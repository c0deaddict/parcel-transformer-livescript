// @flow
import {Transformer} from '@parcel/plugin';
import SourceMap from '@parcel/source-map';
import livescript from 'livescript';
import {relativeUrl} from '@parcel/utils';

export default (new Transformer({
  async transform({asset, options}) {
    let sourceFileName = relativeUrl(
      options.projectRoot,
      asset.filePath,
    );

    asset.type = 'js';
    let output = livescript.compile(await asset.getCode(), {
      bare: true,
      filename: sourceFileName,
      map: !!asset.env.sourceMap,
    });

    // return from compile is based on sourceMap option
    if (asset.env.sourceMap) {
      let map = null;
      if (output.map) {
        map = new SourceMap(options.projectRoot);
        map.addVLQMap(JSON.parse(output.map));
      }

      asset.setCode(output.code);
      asset.setMap(map);
    } else {
      asset.setCode(output);
    }

    return [asset];
  },
}));
