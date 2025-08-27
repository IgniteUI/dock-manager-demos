import { LitElement, html, unsafeCSS, nothing } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import {
    defineComponents,
    IgcChatComponent,
    IgcMessage,
} from 'igniteui-webcomponents';
import styles from './stream-chat.scss?inline';
import { preloadedMessages, StagedMsg, streamingMessages } from '../../data/stream-chat.ts';

defineComponents(IgcChatComponent);

@customElement('app-stream-chat')
export default class StreamChat extends LitElement {
    @query('igc-chat') private chat!: IgcChatComponent;

    /** staged/meta per messageId */
    private messageData = new Map<string, StagedMsg>();

    /** ids of messages that should animate as "new" */
    private newMessageIds = new Set<string>();

    private sleep(ms: number) {
        return new Promise((r) => setTimeout(r, ms));
    }
    private makeId(): string {
        return crypto.randomUUID();
    }

    private appendMessage(msg: IgcMessage, isNew = true) {
        if (isNew) this.newMessageIds.add(msg.id);
        this.chat.messages = [...(this.chat.messages ?? []), msg];
    }

    private appendStaged(s: StagedMsg, isNew = true) {
        const sender = s.isSelf ? 'user' : s.username;
        const id = this.makeId();

        this.messageData.set(id, s);

        const msg: IgcMessage = {
            id,
            text: s.message,
            sender,
            timestamp: new Date(),
            attachments: [],
        };

        this.appendMessage(msg, isNew);
    }

    /** ---- USER SEND → BOT REPLY (with typing) ---- */
    private async onUserMessage(e: CustomEvent) {
        const newMsg = e.detail as { text: string; sender: string };
        if (!newMsg?.text?.trim()) return;

        // clear input immediately
        this.chat.draftMessage = { text: '', attachments: [] };

        const replyId = this.makeId();
        const reply: IgcMessage = {
            id: replyId,
            text: 'This is an igc chat demo ',
            sender: '🤖 Chat Bot ',
            timestamp: new Date(),
            attachments: [],
        };

        this.appendMessage(reply, true);
    }

    /** ---- CUSTOM SEND BUTTON ---- */
    private handleCustomSendClick = () => {
        const chat = this.chat;
        if (!chat) return;

        const text = chat.draftMessage?.text?.trim() ?? '';
        if (!text) return;

        const id = Date.now().toString();
        const newMessage: IgcMessage = {
            id,
            text,
            sender: 'user',
            attachments: chat.draftMessage?.attachments || [],
            timestamp: new Date(),
        };

        this.appendMessage(newMessage, /*isNew*/ true);
        chat.draftMessage = { text: '', attachments: [] };
    };

    protected async firstUpdated() {
        this.chat.options = {
            inputPlaceholder: 'Type your message...',
            suggestions: [],
            disableAttachments: true,
            templates: {
                messageActionsTemplate: () => nothing,
                messageTemplate: (message: IgcMessage) => {
                    const stagedData = this.messageData.get(message.id);
                    const isNew = this.newMessageIds.has(message.id);

                    return html`
            <style>
                .sm-message {
                    /* Body 2 */
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 20px;
                    margin-inline: 16px;
                }
                .sm-message__time { color: var(--ig-gray-500); }
                .sm-message__username { font-weight: 700; }
                .sm-message--viewer { .sm-message__username { color: var(--ig-warn-700); } }
                .sm-message--moderator { .sm-message__username { color: #9AF2E4; } }
                .sm-message--streamer { .sm-message__username { color: #8B5BB1; } }
                .sm-message--bot { .sm-message__username { color: #F59321; } }
                .sm-message--broadcaster { .sm-message__username { color: #6DB1FF; } }
                .sm-message--subscriber { .sm-message__username { color: #EE5879; } }
                .sm-message__badges {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    igc-icon { --ig-size: 1; color: var(--sm-dim-purple); }
                }
                .sm-message__info {
                    float: left;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    margin-inline-end: 4px;
                }

                .sm-message--new {
                    transition: background 500ms ease-out;
                    animation: new-message-enter 500ms ease-out forwards;
                }

                @keyframes new-message-enter {
                    from, to { transform: scale(1, 1); }
                    25% { transform: scale(0.9, 1.1); }
                    50% { transform: scale(1.1, 0.9); }
                    75% { transform: scale(0.95, 1.05); }
                }

                igc-chat::part(typing-indicator) {
                    color: var(--ig-gray-700);
                }

            </style>
            <div
              class="sm-message sm-message--${stagedData?.role || 'user'} ${isNew ? 'sm-message--new' : ''}"
              @animationend=${() => this.newMessageIds.delete(message.id)}
            >
              <span class="sm-message__time">
                ${message.timestamp
                        ? message.timestamp.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false })
                        : ''}
              </span>
              <span class="sm-message__username">${stagedData?.username || message.sender}:</span>
              <span class="sm-message__text"> ${message.text} </span>
            </div>
          `;
                },
                textAreaActionsTemplate: html`
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

                                &:hover {
                                    cursor: pointer;
                                    --color: var(--sm-special-purple);
                                }
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
                        <igc-button class="stream-send-btn" @click=${this.handleCustomSendClick}>
                            Send
                        </igc-button>
                    </div>
                    </div>
                `
            },
        };

        this.chat.messages = [];
        this.chat.draftMessage = { text: '', attachments: [] };

        // Preload
        for (const s of preloadedMessages) {
            this.appendStaged(s, false);
        }

        // Mark as "new"
        for (const s of streamingMessages) {
            await this.sleep(3000);      // your stagger
            this.appendStaged(s, /*isNew*/ true);
        }
    }

    render() {
        return html`<igc-chat @igcMessageCreated=${this.onUserMessage}></igc-chat>`;
    }

    static styles = unsafeCSS(styles);
}
