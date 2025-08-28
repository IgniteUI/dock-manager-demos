import { LitElement, html, unsafeCSS, nothing } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import {
    defineComponents,
    IgcChatComponent,
    IgcMessage,
} from 'igniteui-webcomponents';
import styles from './stream-chat.scss?inline';
import {
    preloadedMessages,
    streamingMessages,
    type StagedMsg,
} from '../../data/stream-chat.ts';

defineComponents(IgcChatComponent);

type MessageEventDetail = { text: string; sender: string };
type Draft = { text: string; attachments: NonNullable<IgcMessage['attachments']> };
type StagedWithTs = StagedMsg & { ts: Date };

const TYPING_DELAY_MS = 400;
const STREAM_STAGGER_MS = 3000;
const EMPTY_DRAFT: Draft = { text: '', attachments: [] };

@customElement('app-stream-chat')
export default class StreamChat extends LitElement {
    @query('igc-chat') private chat!: IgcChatComponent;

    // Holds per-message metadata (role, username, etc.) normalized with a Date
    private readonly messageData = new Map<string, StagedWithTs>();

    // Tracks IDs of messages flagged as "new" (used only for animation)
    private readonly newMessageIds = new Set<string>();

    // Shared formatter instance (avoids reallocation per render)
    private readonly timeFmt = new Intl.DateTimeFormat(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });

    // Controller used to safely cancel async streaming when the component unmounts
    private streamAbort: AbortController = new AbortController();

    // ---------- utilities ----------

    private now(): Date {
        return new Date();
    }

    private nowISO(): string {
        return this.now().toISOString();
    }

    private makeId(): string {
        return typeof crypto?.randomUUID==='function'
            ? crypto.randomUUID()
            : `${ Date.now() }-${ Math.random().toString(36).slice(2, 10) }`;
    }

    private resetAbort(): void {
        this.streamAbort = new AbortController();
    }

    // Abort-safe sleep helper for typing and streaming delays
    private sleep(ms: number, signal?: AbortSignal): Promise<void> {
        if (!ms || signal?.aborted) return Promise.resolve();
        return new Promise((resolve, reject) => {
            const id = setTimeout(resolve, ms);
            signal?.addEventListener(
                'abort',
                () => {
                    clearTimeout(id);
                    reject(new DOMException('Aborted', 'AbortError'));
                },
                { once: true },
            );
        });
    }

    private formatTime(d?: Date | string | number): string {
        if (!d) return '';
        const date = d instanceof Date ? d: new Date(d);
        if (Number.isNaN(date.getTime())) return '';
        return this.timeFmt.format(date);
    }

    private setDraftEmpty(): void {
        if (this.chat) this.chat.draftMessage = { ...EMPTY_DRAFT };
    }

    private toDate(value: unknown): Date {
        // Normalize staged "time" values (string, number, or Date) into a Date object
        if (typeof value === 'string') {
            // If it's a clock-like time (e.g., "1:27" or "11:05"), interpret it as "today at HH:MM"
            const m = value.match(/^(\d{1,2}):(\d{2})$/);
            if (m) {
                const [, hhStr, mmStr] = m;
                const hh = Number(hhStr);
                const mm = Number(mmStr);
                const d = this.now();
                d.setSeconds(0, 0);
                d.setHours(Math.max(0, Math.min(23, hh)), Math.max(0, Math.min(59, mm)));
                return d;
            }
            // Fallback to Date parsing for other string formats
            const d = new Date(value);
            return Number.isNaN(d.getTime()) ? this.now() : d;
        }
        if (typeof value === 'number') {
            const d = new Date(value);
            return Number.isNaN(d.getTime()) ? this.now() : d;
        }
        if (value instanceof Date) return value;
        return this.now();
    }

    private extractText(e: CustomEvent<MessageEventDetail>): string | null {
        const t = e.detail?.text;
        if (typeof t!=='string') return null;
        const trimmed = t.trim();
        return trimmed.length ? trimmed: null;
    }

    // ---------- message builders ----------

    // Centralized builder for IgcMessage, ensures consistent shape
    private buildIgcMessage(
        partial: Pick<IgcMessage, 'text' | 'sender'> & Partial<IgcMessage>,
    ): IgcMessage {
        return {
            id: partial.id ?? this.makeId(),
            text: partial.text,
            sender: partial.sender,
            timestamp: partial.timestamp ?? this.now(),
            attachments: partial.attachments ?? [],
        };
    }

    // Centralized builder for staged metadata
    private buildStaged(
        username: string,
        role: StagedMsg['role'],
        message: string,
        isSelf: boolean,
    ): StagedMsg {
        return { username, role, message, isSelf, time: this.nowISO() };
    }

    // Normalize and store staged meta into the map with a resolved Date
    private storeMeta(id: string, staged: StagedMsg): void {
        const normalized: StagedWithTs = { ...staged, ts: this.toDate(staged.time) };
        this.messageData.set(id, normalized);
    }

    // ---------- append helpers ----------

    private appendMessage(msg: IgcMessage, isNew = true): void {
        if (!this.chat) return;
        if (isNew) this.newMessageIds.add(msg.id);
        this.chat.messages = [...(this.chat.messages ?? []), msg]; // immutable update
    }

    private appendStaged(s: StagedMsg, isNew = true): void {
        const id = this.makeId();
        this.storeMeta(id, s);
        const msg = this.buildIgcMessage({
            id,
            text: s.message,
            sender: s.isSelf ? 'user': s.username,
            timestamp: this.messageData.get(id)!.ts,
        });
        this.appendMessage(msg, isNew);
    }

    // ---------- bot flow ----------

    // Simulates typing delay, then posts a bot reply (with staged meta)
    private async sendBotReply(): Promise<void> {
        if (this.streamAbort.signal.aborted) return;
        await this.sleep(TYPING_DELAY_MS, this.streamAbort.signal);

        const text = 'This is an igc-chat component demo, for more info visit:';
        const id = this.makeId();

        this.storeMeta(id, this.buildStaged('🤖 Auto Replay ', 'igc-bot', text, false));
        this.appendMessage(this.buildIgcMessage({ id, text, sender: '🤖 Auto Replay ' }), true);
    }

    // ---------- user flows ----------

    // Fired when <igc-chat> emits a new message
    private onUserMessage = async (e: CustomEvent<MessageEventDetail>) => {
        const text = this.extractText(e);
        if (!text) return;
        this.setDraftEmpty();
        await this.sendBotReply();
    };

    // Fired when the custom "Send" button is clicked
    private handleCustomSendClick = async () => {
        const chat = this.chat;
        if (!chat) return;

        const text = chat.draftMessage?.text?.trim() ?? '';
        if (!text) return;

        const id = this.makeId();
        this.storeMeta(id, this.buildStaged('user', 'user', text, true));
        this.appendMessage(
            this.buildIgcMessage({
                id,
                text,
                sender: 'user',
                attachments: chat.draftMessage?.attachments || [],
            }),
            true,
        );
        this.setDraftEmpty();
        await this.sendBotReply();
    };

    // ---------- templates ----------

    private renderMessage = (message: IgcMessage) => {
        const stagedData = this.messageData.get(message.id);
        const isNew = this.newMessageIds.has(message.id);
        const role = stagedData?.role || 'user';
        const author = stagedData?.username || message.sender;
        const badge = stagedData?.badges;
        const tsMsg = (!Number.isNaN(message.timestamp.getTime())) ? message.timestamp : undefined;
        const tsMeta = (stagedData?.ts instanceof Date && !Number.isNaN(stagedData.ts.getTime())) ? stagedData.ts : undefined;
        const ts = tsMsg ?? tsMeta;

        return html`
            <style>
                .sm-message {
                    /* Body 2 */
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 20px;
                    position: relative;
                }

                .sm-message__time {
                    color: var(--ig-gray-500);
                    float: left;
                }

                .sm-message__username {
                    font-weight: 700;
                }

                .sm-message__time,
                .sm-message__username,
                .sm-message__badges,
                .sm-message__text {
                    position: relative;
                    z-index: 1;
                }

                .sm-message--viewer {
                    .sm-message__username {
                        color: var(--ig-warn-700);
                    }
                }

                .sm-message--moderator {
                    .sm-message__username {
                        color: #9AF2E4;
                    }
                }

                .sm-message--streamer {
                    .sm-message__username {
                        color: #8B5BB1;
                    }
                }

                .sm-message--bot {
                    .sm-message__username {
                        color: #F59321;
                    }
                }

                .sm-message--broadcaster {
                    .sm-message__username {
                        color: #6DB1FF;
                    }
                }

                .sm-message--subscriber {
                    .sm-message__username {
                        color: #EE5879;
                    }
                }

                .sm-message--igc-bot {
                    .sm-message__username {
                        color: var(--ig-gray-500);
                    }

                    .sm-message__text {
                        color: var(--ig-gray-300);
                    }
                }

                .sm-message--user {
                    .sm-message__username {
                        color: #fff;
                    }
                }

                .sm-message__badges {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;

                    igc-icon {
                        --ig-size: 1;
                        color: var(--sm-dim-purple);
                    }
                }

                .sm-message__info {
                    float: left;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    margin-inline-end: 4px;
                    z-index: 1;
                }

                .sm-message--new {
                    transition: background 500ms ease-out;
                    animation: new-message-enter 500ms ease-out forwards;
                }

                @keyframes new-message-enter {
                    from, to {
                        transform: scale(1, 1);
                    }
                    25% {
                        transform: scale(0.9, 1.1);
                    }
                    50% {
                        transform: scale(1.1, 0.9);
                    }
                    75% {
                        transform: scale(0.95, 1.05);
                    }
                }
            </style>
            <div
                class="sm-message sm-message--${ role } ${ isNew ? 'sm-message--new': '' }"
                @animationend=${ () => this.newMessageIds.delete(message.id) }
            >
                <div class="sm-message__info">
                    <span class="sm-message__time">
                      ${ this.formatTime(ts) }
                    </span>

                    
                      ${badge ? html`
                          <span class="sm-message__badges">
                            <igc-icon name="${badge}" collection="material"></igc-icon>
                          </span>
                      ` : nothing}

                    ${role === 'user' ? html`
                        <span class="sm-message__badges">
                            <igc-icon name="verified" collection="material"></igc-icon>
                        </span>
                   ` : nothing}
                    
                </div>

                <span class="sm-message__username">
                    ${ author }:
                </span>
                
                <span class="sm-message__text">
                    ${ message.text } 
                    
                    ${ role === 'igc-bot' ? html`
                        <a href="https://github.com/IgniteUI/igniteui-webcomponents/wiki/Chat-UI-Component" target="_blank">Documentation</a>
                    ` : nothing}
                    
                </span>
            </div>
        `;
    };

    private renderTextAreaActions = () => html`
        <style>
            .sm-input-actions {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-grow: 1;
            }

            .sm-input-actions__icons {
                igc-icon {
                    --ig-size: 1;
                    --color: var(--sm-dim-purple);
                    padding: 7px;
                    border-radius: 4px;
                }

                igc-icon:hover {
                    cursor: pointer;
                    --color: var(--sm-special-purple);
                }

                display: flex;
                align-items: center;
            }

            igc-button::part(base) {
                min-width: 0;
            }
        </style>
        <div class="sm-input-actions">
            <div class="sm-input-actions__icons">
                <igc-icon name="tag-face" collection="material"></igc-icon>
                <igc-icon name="diamond" collection="material"></igc-icon>
                <igc-icon name="settings" collection="material"></igc-icon>
            </div>
            <igc-button class="stream-send-btn" @click=${ this.handleCustomSendClick }>
                Send
            </igc-button>
        </div>
    `;

    // ---------- lifecycle ----------

    protected async firstUpdated() {
        await this.updateComplete;
        await this.chat?.updateComplete;
        if (!this.chat) return;

        // Configure chat only once it’s fully upgraded
        this.chat.options = {
            inputPlaceholder: 'Write a message here',
            suggestions: [],
            disableInputAttachments: true,
            templates: {
                messageActionsTemplate: () => nothing,
                messageTemplate: (m: IgcMessage) => this.renderMessage(m),
                messageAuthorTemplate: (m: IgcMessage) => this.renderMessage(m),
                textAreaActionsTemplate: () => this.renderTextAreaActions(),
            },
        };

        this.chat.messages = [];
        this.chat.draftMessage = { ...EMPTY_DRAFT };

        // Historical preload (not flagged as new)
        for (const s of preloadedMessages) this.appendStaged(s, false);

        // Stream staged messages gradually (abort-safe)
        try {
            for (const s of streamingMessages) {
                await this.sleep(STREAM_STAGGER_MS, this.streamAbort.signal);
                this.appendStaged(s, true);
            }
        } catch (err) {
            if (!(err instanceof DOMException && err.name==='AbortError')) {
                // eslint-disable-next-line no-console
                console.error('Streaming failed:', err);
            }
        }
    }

    disconnectedCallback(): void {
        // Cancel timers to prevent updates after disconnect
        this.streamAbort.abort();
        this.resetAbort();
        super.disconnectedCallback();
    }

    render() {
        return html`
            <igc-chat @igcMessageCreated=${ this.onUserMessage }></igc-chat>`;
    }

    static styles = unsafeCSS(styles);
}
