import { SktSerializable } from "../serializable"
import { ClassConstructor } from "./class-constructor"

export interface ISktPropertyMeta {
    key: string,
    typeName?: string,
}

export interface ISktClassMeta {
    extends?: ClassConstructor<SktSerializable>,
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

export function getProperties(target: ClassConstructor<SktSerializable>): ISktPropertyMetaInfo[] {
    const meta = sktClassMeta[target.name]
    if (!meta) {
        return []
    }
    let properties = meta.properties
    if(meta.extends) {
        properties = properties.concat(getProperties(meta.extends))
    }
    return properties.map(p => {
        return {
            key: p.key,
            type: p.typeName ? sktClassMeta[p.typeName].type : undefined
        }
    })
}
