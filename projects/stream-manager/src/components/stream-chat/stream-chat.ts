// dock-manager.ts
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, query } from 'lit/decorators.js';
import {
    defineComponents,
    IgcChatComponent,
    IgcMessage,
} from 'igniteui-webcomponents';
import styles from './stream-chat.scss?inline';
import { preloadedMessages, StagedMsg, streamingMessages } from '../../data/stream-chat.ts';

// Register the chat component so it can be used in HTML
defineComponents(IgcChatComponent);

/**
 * <app-stream-chat>
 *
 * A sample wrapper around Ignite UI's <igc-chat>.
 * - Streams staged demo messages into the chat.
 * - Handles user input via @igcMessageCreated.
 * - Demonstrates use of options, draftMessage, and isTyping indicators.
 */
@customElement('app-stream-chat')
export default class StreamChat extends LitElement {
    // Reference to the underlying <igc-chat> element
    @query('igc-chat') private chat!: IgcChatComponent;

    // Store additional message data
    private messageData = new Map<string, StagedMsg>();

    /**
     * Utility: async delay for simulating "natural" message timing.
     */
    private sleep(ms: number) {
        return new Promise((r) => setTimeout(r, ms));
    }

    /**
     * Utility: generate unique IDs for messages.
     * crypto.randomUUID() is safer than Math.random().
     */
    private makeId(): string {
        return crypto.randomUUID();
    }

    /**
     * Append a message from staged demo data.
     * Store the original staged data separately for use in the template.
     */
    private appendStaged(s: StagedMsg) {
        const sender = s.isSelf ? 'user' : s.username;
        const messageId = this.makeId();

        // Store the staged data
        this.messageData.set(messageId, s);

        const msg: IgcMessage = {
            id: messageId,
            text: s.message, // Just the clean message content
            sender,
            timestamp: new Date(),
            attachments: [],
        };

        this.chat.messages = [...(this.chat.messages ?? []), msg];
    }

    /**
     * Handles user-submitted messages (via @igcMessageCreated).
     * Clears the draft, simulates bot typing, then appends a demo reply.
     */
    private async onUserMessage(e: CustomEvent) {
        const newMsg = e.detail as { text: string; sender: string };
        if (!newMsg?.text?.trim()) return;

        // Reset the input box
        this.chat.draftMessage = {
            text: '',
            attachments: []
        };

        // Show the "typing …" state
        this.chat.options = {
            ...this.chat.options,
            isTyping: true
        };

        await this.sleep(600);

        // Demo bot reply
        const reply: IgcMessage = {
            id: this.makeId(),
            text: 'This is an igc chat demo',
            sender: 'bot',
            timestamp: new Date(),
            attachments: [],
        };

        this.chat.messages = [...(this.chat.messages ?? []), reply];

        this.chat.options = {
            ...this.chat.options,
            isTyping: false
        };
    }

     handleCustomSendClick() {
        const chat = document.querySelector('igc-chat');
        if (!chat) {
            return;
        }
        const newMessage: IgcMessage = {
            id: Date.now().toString(),
            text: chat.draftMessage.text,
            sender: 'user',
            attachments: chat.draftMessage.attachments || [],
            timestamp: new Date(),
        };
        chat.messages = [...chat.messages, newMessage];
        chat.draftMessage = { text: '', attachments: [] };
    }

    /**
     * Lifecycle: runs after first render.
     * - Configures chat options (header, suggestions, etc.).
     * - Clears state.
     * - Preloads first 12 messages immediately, then streams the rest with delays.
     */
    protected async firstUpdated() {
        this.chat.options = {
            headerText: 'Live Chat',
            inputPlaceholder: 'Type your message...',
            suggestions: [],                 // <- clear suggestions
            disableAttachments: true,
            templates: {
                messageActionsTemplate: () => html``,messageTemplate: (message: IgcMessage) => {
                    const stagedData = this.messageData.get(message.id);

                    return html`
                        <style>
                            .sm-message {
                                /* Body 2 */
                                font-size: 14px;
                                font-style: normal;
                                font-weight: 400;
                                line-height: 20px;
                            }
                            
                            .sm-message__time {
                                color: var(--ig-gray-500);
                            }

                            .sm-message__username {
                                font-weight: 700;
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
                            }
                        </style>
                        <div class="sm-message sm-message--${ stagedData?.role || 'user' }">
                            <div class="sm-message__info">
                                <span class="sm-message__time">
                                    ${ stagedData?.time || message.timestamp?.toLocaleTimeString()}
                                </span>
                                    <span class="sm-message__badges">
                                    ${stagedData?.badges?.map(badge => html`<igc-icon name="${badge}" collection="material"></igc-icon>`)}
                                </span>
                                <span class="sm-message__username">${ stagedData?.username || message.sender }:</span>
                            </div>
                            <span class="sm-message__username-text">${ message.text }</span>
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

        // Preload the first 12 messages immediately
        for (const s of preloadedMessages) {
            this.appendStaged(s);
        }

        // Add a short delay before streaming the additional messages
        await this.sleep(2000);

        // Stream the remaining messages with delays
        for (const s of streamingMessages) {
            await this.sleep(700);
            this.appendStaged(s);
            await this.sleep(300);
        }
    }

    /**
     * Render the chat container.
     * Height is capped via a CSS variable for demo purposes.
     */
    render() {
        return html`
            <igc-chat
                @igcMessageCreated=${this.onUserMessage}>
            </igc-chat>
        `;
    }

    static styles = unsafeCSS(styles);
}
