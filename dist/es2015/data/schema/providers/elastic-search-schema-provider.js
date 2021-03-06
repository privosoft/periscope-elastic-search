import { inject } from 'aurelia-framework';
import { SchemaProvider } from 'periscope-framework';
import * as _ from 'lodash';

export let ElasticSearchSchemaProvider = class ElasticSearchSchemaProvider extends SchemaProvider {
  constructor(http, host, index, type) {
    super();
    this.host = host;
    this.index = index;
    this.type = type;
    this._http = http;
  }
  getSchema() {
    return this._http.fetch(this.host + "_mappings/" + this.type).then(response => {
      return response.json();
    }).then(jsonData => {
      let flds = jsonData[this.index].mappings[this.type].properties;
      let result = [];
      _.forOwn(flds, (value, key) => {
        let t = value.type;
        if (t === 'float') t = "number";
        result.push({ field: key, type: t });
      });
      return {
        fields: result
      };
    });
  }
};