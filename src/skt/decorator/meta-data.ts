import { SktSerializable } from "../serializable"
import { ClassConstructor } from "./class-constructor"
import { parentClass } from "./parent-class"

export interface ISktPropertyMeta {
    key: string,
    typeName?: string,
}

export interface ISktClassMeta {
    type?: ClassConstructor<SktSerializable>,
    properties: ISktPropertyMeta[]
}

export interface ISktPropertyMetaInfo {
    key: string,
    type: ClassConstructor<SktSerializable>
}

export const sktClassMeta: {
    [key: string]: ISktClassMeta
} = {}

export function sktGetProperties(target: ClassConstructor<SktSerializable>): ISktPropertyMetaInfo[] {
    const meta = sktClassMeta[target.name]
    if (!meta) {
        return []
    }
    let properties = meta.properties
    let parentType = parentClass(target)
    if(parentType && sktClassMeta[parentType.name]) {
        properties = properties.concat(sktGetProperties(parentType))
    }
    return properties.map(p => {
        return {
            key: p.key,
            type: p.typeName ? sktClassMeta[p.typeName].type : undefined
        }
    })
}

export function sktGetClass(target: string) : ISktClassMeta {
    return sktClassMeta[target]
}
