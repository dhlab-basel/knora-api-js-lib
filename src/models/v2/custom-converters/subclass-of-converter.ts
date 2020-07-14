import { JsonConverter, JsonCustomConvert } from "json2typescript";
import { CustomConverterUtils } from "../../../util/utils";

@JsonConverter
export class SubClassOfConverter implements JsonCustomConvert<string[]> {
    serialize(subclasses: string[]): any {
        // TODO: not sure if it's correct. I have to update case 1: (subclasses.length > 1)
        if (subclasses.length > 1) {
            const subClassOf: any = [];
            subclasses.forEach(item => {
                subClassOf.push({ "@id": item })
            });
            return subClassOf;

        } else {
            return {
                "@id": subclasses[0]
            };
        }
    }

    deserialize(items: any): string[] {
        const subclassOf: string[] = [];

        const addItem = (ele: any) => {
            if (ele.hasOwnProperty("@id") && CustomConverterUtils.isString(ele["@id"])) {
                subclassOf.push(ele["@id"]);
            }
        };

        if (Array.isArray(items)) {
            items.forEach(item => addItem(item));
        } else {
            addItem(items);
        }

        return subclassOf;
    }
}
