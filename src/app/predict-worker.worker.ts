// const tf = require('@tensorflow/tfjs');

// tf.setBackend('cpu');

addEventListener('message', ({ data }) => {
  console.log(data);
  // if (!this.model) {
  //   this.model = createModel();
  // }
  // if (data.image) {
  //   const output = this.model.predict(data.image);
  //   const result = Array.from(output.dataSync());
  //   postMessage(result);
  //   output.dispose();
  // } else {
  //   postMessage('failed');
  // }
});

// async function createModel() {
//   const model = await tf.loadLayersModel('assets/trained/model.json');
//   return model;
// }
