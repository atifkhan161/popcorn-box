export class baseModel {
    fillFromJSON(jsonObj: any) {
        for (var propName in jsonObj) {
            this[propName] = jsonObj[propName]
        }
    }
}