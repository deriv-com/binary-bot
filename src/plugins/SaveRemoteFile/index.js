const download = require('download');

class SaveRemoteFile {
  constructor(options) {
    if (options instanceof Array) {
      this.options = options;
    } else {
      this.options = [options];
    }
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      {
        name: 'SaveRemoteFilePlugin',
        context: true,
      },
      (context, compilation, callback) => {
        let count = this.options.length;
        const downloadFiles = (option) => {
          const reportProgress = context && context.reportProgress;

          download(option.url).then(data => {
            compilation.assets[option.filepath] = {
              size: () => data.length,
              source: () => data,
            };
            if (reportProgress) {
              reportProgress(95.0, 'Remote file downloaded: ', option.filepath);
            }
            // Issue the calback after all files have been processed
            count--;
            if (count === 0) {
              callback();
            }
          }).catch(error => {
            compilation.errors.push(new Error(error));
            callback();
          });
        };
        this.options.forEach(downloadFiles);
      }
    );
  }
};

module.exports = SaveRemoteFile;