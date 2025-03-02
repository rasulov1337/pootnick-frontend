import BaseComponent from '../BaseComponent/BaseComponent';
import globalStore from '../../modules/GlobalStore';
import { convertTimeToMinutesAndSeconds } from '../../modules/Utils';
import { Message } from '../../repositories/ChatRepository';

interface BackendReply {
    response: string;
    sent: boolean;
}

export default class ChatWindow extends BaseComponent {
    private messages: Message[];
    private messagesContainer: HTMLDivElement;
    private recipientId: string;
    private messageQueue: Message[] = [];

    constructor(
        parent: HTMLElement,
        recipientId: string,
        recipientName: string,
        messages: Message[]
    ) {
        super({
            parent: parent,
            id: '0',
            templateData: {
                recipientName,
            },
            templateName: 'ChatWindow',
        });

        this.recipientId = recipientId;
        this.messages = messages;

        if (
            !globalStore.chat.socket ||
            globalStore.chat.socket.readyState === WebSocket.CLOSED ||
            globalStore.chat.socket.readyState === WebSocket.CLOSING
        ) {
            globalStore.chat.socket = new WebSocket(
                `wss://${window.location.hostname}:${location.port}/websocket`
            );
        }
    }

    protected afterRender() {
        this.messagesContainer = document.getElementById(
            'js-messages'
        ) as HTMLDivElement;

        this.displayMessageHistory();

        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    private async displayMessageHistory() {
        for (const message of this.messages) {
            this.addNewMessageElement(message);
        }
    }

    private attachSocketEventListeners() {
        const socket = globalStore.chat.socket;
        if (!socket) {
            throw new Error('socket is null!');
        }

        socket.onopen = (e) => {
            console.log('[open] Соединение установлено');
        };

        socket.onmessage = (e) => this.handleMessageReceive(e);

        socket.onclose = function (event) {
            if (event.wasClean) {
                console.log(
                    `[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`
                );
            } else {
                // например, сервер убил процесс или сеть недоступна
                // обычно в этом случае event.code 1006
                console.log('[close] Соединение прервано');
            }
        };

        socket.onerror = function (error) {
            console.error(error);
        };
    }

    protected addEventListeners(): void {
        this.attachSocketEventListeners();

        window.onbeforeunload = () => {
            // If user wants to refresh page close the connection
            globalStore.chat.socket?.close();
            globalStore.chat.socket = null;
        };

        const textArea = this.thisElement.querySelector(
            '.js-message-input'
        ) as HTMLInputElement;

        /** Resizes <textarea> to fit the content */
        const resizeTextArea = () => {
            textArea.style.cssText = 'height: auto';
            textArea.style.cssText = 'height:' + textArea.scrollHeight + 'px';
        };

        textArea.oninput = resizeTextArea;

        const sendMessageButton = document.getElementById(
            'js-send-message-button'
        ) as HTMLButtonElement;

        /** Sends message and clears input */
        const sendMessage = (e: Event) => {
            // Prevent from new line
            e.preventDefault();
            e.stopPropagation();

            const text = textArea.value;
            this.sendMessage(text);
            textArea.value = '';
            resizeTextArea();
        };

        sendMessageButton.onclick = sendMessage;

        textArea.onkeydown = (event) => {
            if (!event.shiftKey && !event.ctrlKey && event.key === 'Enter') {
                sendMessage(event);
            }
        };
    }

    private sendMessage(text: string) {
        if (!globalStore.chat.socket) return;

        try {
            globalStore.chat.socket.send(
                JSON.stringify({
                    receiverId: this.recipientId,
                    content: text,
                })
            );

            this.messageQueue.push({
                content: text,
                receiverId: '',
                senderId: globalStore.auth.userId!,
                id: 0,
                createdAt: new Date().toISOString(),
            });
        } catch (e) {
            console.error('Error:', e);
        }
    }

    private handleMessageReceive(event: MessageEvent) {
        let message;

        try {
            message = JSON.parse(event.data) as Message | BackendReply;
        } catch {
            console.warn('Received non-JSON message! Ignoring it');
            return;
        }

        console.log(`[message] Данные получены с сервера: ${message}`);
        if ('content' in message) {
            this.emit('new-message', message.content);
            this.addNewMessageElement(message);

            this.scrollToTheBottom();
        } else {
            const outComingMessage = this.messageQueue.shift();
            if (!outComingMessage || !message.sent) return;

            this.addNewMessageElement(outComingMessage);
            this.scrollToTheBottom();
            this.emit('new-message', outComingMessage.content);
        }
    }

    private addNewMessageElement(message: Message) {
        const template = document.getElementById(
            'js-chat-message-template'
        ) as HTMLTemplateElement;

        const newMessage = template.content.cloneNode(true) as DocumentFragment;
        (
            newMessage.querySelector('.js-message-text') as HTMLSpanElement
        ).textContent = message.content;

        (
            newMessage.querySelector('.js-message-time') as HTMLSpanElement
        ).textContent = convertTimeToMinutesAndSeconds(message.createdAt);

        if (message.senderId == globalStore.auth.userId) {
            newMessage.children[0]!.classList!.add('message--mine');
        }

        this.messagesContainer.appendChild(newMessage);
    }

    private scrollToTheBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}
