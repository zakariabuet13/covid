importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs');

addEventListener('message', async function (event) {
  try {
    if (event.data.data === 'load-model') {
      if (!this.model) {
        this.model = await tf.loadLayersModel('./trained/model.json');
        self.postMessage('model loaded');
      }
    } else {
      image = event.data.data;

      if (!this.model) {
        this.model = await tf.loadLayersModel('./model/model.json');
      }

      img = tf.browser.fromPixels(image, 3);
      imgtmp = img.reshape([1, 224, 224, 3]);
      imgtmp = tf.cast(imgtmp, 'float32');

      output = this.model.predict(imgtmp);
      result = Array.from(output.dataSync());

      self.postMessage(result);
      output.dispose();
    }
  } catch (err) {
    console.log(err);
    self.postMessage('failed');
  }
});
