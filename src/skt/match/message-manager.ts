
export class SktMessageManager {
    private _listeners: {
        [key: number] : {
            [key: string]: ((data: any, sender: nkruntime.Presence) => void)[]
        }
    } = {}
    constructor(
        readonly nk: nkruntime.Nakama,
        readonly dispatcher?: nkruntime.MatchDispatcher,
        readonly messages?: nkruntime.MatchMessage[],
    ){}

    addListener<T>(opCode: number, callback: (data: T, sender: nkruntime.Presence) => void, sender: nkruntime.Presence[] | null = null): void {
        let code = this._listeners[opCode];
        if (!code) {
            code = {}
            this._listeners[opCode] = code
        }
        if(!sender) {
            const listeners = code['all'];
            if (!listeners) {
                code['all'] = [callback]
            } else {
                listeners.push(callback)
            }

        } else {
            sender.forEach(p => {
                const listeners = code[p.userId];
                if (!listeners) {
                    code[p.userId] = [callback]
                } else {
                    listeners.push(callback)
                }
            })
        }
    }

    send<T>(opCode: number, data: T, target: nkruntime.Presence[] | null = null): void {
        this.dispatcher?.broadcastMessage(opCode, JSON.stringify(data), target)
    }

    emit() {
        this.messages?.forEach((message) => {
            const code = this._listeners[message.opCode]
            const user = message.sender
            if (code) {
                const allListeners = code['all'] ?? []
                const userListeners = code[user.userId] ?? []
                const listeners = allListeners.concat(userListeners)
                listeners.forEach((listener) => {
                    // listener(JSON.parse(message.data), user)
                })
            }

        })
    }
}