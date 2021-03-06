import { JsonConverter } from "json2typescript";
import { IUrl } from "../../../interfaces/models/v2/project-metadata-interfaces";
import { Constants } from "../Constants";
import { BaseUrlConverter } from "./base-url-converter";

/**
 * @category Internal
 */
@JsonConverter
export class UnionUrlStringConverter extends BaseUrlConverter {

    serialize(el: IUrl | string | Array<IUrl | string>): any {
        if (Array.isArray(el)) {
            return el.map(
                (item: IUrl | string) => this.serializeElement(item)
            );
        } else {
            return this.serializeElement(el);
        }
    }

    deserialize(el: any): Array<IUrl | string> {
        if (Array.isArray(el)) {
            return el.map(
                (item: any) => this.deserializeElement(item)
            );
        } else {
            const newArr = [] as Array<IUrl | string>;
            newArr.push(this.deserializeElement(el));
            return newArr;
        }
    }

    protected serializeElement(el: IUrl | string): object | string {
        if (typeof el === "string") {
            return el;
        } else if (!(typeof el === "string")) {
            if (el.hasOwnProperty(Constants.SchemaPropID)) {
                return {
                    "@type": Constants.SchemaUrlType,
                    [Constants.SchemaPropID]: {
                        "@type": Constants.SchemaPropVal,
                        [Constants.SchemaPropID]: el.name
                    },
                    [Constants.SchemaUrlValue]: el.url
                };
            } else {
                return {
                    "@type": el.type,
                    [Constants.SchemaUrlValue]: el.url
                };
            }
        } else {
            throw new Error(`Serialization error: expected string or IUrl object type.
                Instead got ${typeof el}.`);
        }
    }

    private deserializeElement(el: any): IUrl | string {
        if (typeof el === "string") {
            return el;
        } else if (el.hasOwnProperty("@type") && el["@type"] === Constants.SchemaUrlType) {
            const type = el["@type"];
            const url = el[Constants.SchemaUrlValue];
            if (el.hasOwnProperty(Constants.SchemaPropID)) {
                const name = el[Constants.SchemaPropID][Constants.SchemaPropID];
                return { name, type, url } as IUrl;   
            } else {
                return { type, url } as IUrl;
            }
        } else {
            throw new Error(`Deserialization Error: expected an object with @type property equals 
                to ${Constants.SchemaUrlType} or string.`);
        }
    }
}
