
/**
 * Image Comparison
 * Compare pair of images and get data about their similarity and processing time.
 */

const csvjson = require("csvjson");
const fs = require("fs");
const PNG = require("pngjs").PNG;
const pixelmatch = require("pixelmatch");

// get input from input.csv
const inputCSV = fs.readFileSync("input.csv", { encoding: "utf8" });
console.log("Input:")
console.log(inputCSV);

const inputData = csvjson.toObject(inputCSV);

const outputData=[];
// processing
for (const inputDataItem of inputData) {
    // start time of processing
    const startTime = Date.now();
    // reading the images using their path
    const img1 = PNG.sync.read(fs.readFileSync(inputDataItem["image1"]));
    const img2 = PNG.sync.read(fs.readFileSync(inputDataItem["image2"]));
    const { width, height } = img1;
    // the image object that contains the difference between the pair of images
    const diff = new PNG({ width, height });
    // get the number of different pixels between the pair of images
    const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.0 });
    // end time for processing
    const endTime = Date.now();
    // Insert the result of processing to outputData object
    outputData.push({image1:inputDataItem["image1"], image2:inputDataItem["image2"], similar:(numDiffPixels / (width * height)).toFixed(4), elapsed:(endTime-startTime)/1000 })
}

// print output to output.csv
const outputCSV = csvjson.toCSV(outputData, { headers: "key" });
fs.writeFileSync("output.csv", outputCSV, { encoding: "utf8" })

console.log("\nOutput:")
console.log(outputCSV);
