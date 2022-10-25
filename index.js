exports.handler = async (event) => {
    return await processImage(event);
}
const processImage = async function (event) {
    var resp;
    var text;
    try {
        var aws = require('aws-sdk');
        aws.config.update({
            accessKeyId: 'AKIASATSNDRYUOTL4BR5',
            secretAccessKey: '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',
            region: 'us-east-1'
        });
        const params = {
            Image: {
                S3Object: {
                    Bucket: "imgdecomparacion",
                    Name: "WIN_20221024_15_10_58_Pro.jpg"
                }
            },
            MaxLabels: 10,
            MinConfidence: 80
        };
        const paramsT = {
            Image: {
                S3Object: {
                    Bucket: "imgdecomparacion",
                    Name: "laptopJulianCodi.jpeg"
                }
            },
           /* "Filters": { 
                "RegionsOfInterest": [ 
                   { 
                      "BoundingBox": { 
                         "Height": number,
                         "Left": number,
                         "Top": number,
                         "Width": number
                      }
                   }
                ],
                "WordFilter": { 
                   "MinBoundingBoxHeight": number,
                   "MinBoundingBoxWidth": number,
                   "MinConfidence": number
                }
             },
             "Image": { 
                "Bytes": blob,
                "S3Object": { 
                   "Bucket": "string",
                   "Name": "string",
                   "Version": "string"
                }
             }*/
        };

        const rekognition = new aws.Rekognition();
          
        await rekognition.detectLabels(params, function (err, data) {
            if (err) {
                resp = ("error");
                console.log(err, err.stack);
            }
            else {
                let datas = JSON.parse(JSON.stringify(data));
                for (x of datas.Labels) {
                    if (x.Name == "Laptop") {
                        if (x.Confidence > 80) {
                            resp = ("La confianza es: ".concat(x.Confidence).concat(" Es una laptop "));
                        }
                        else {
                            resp = ("no tiene la suficiente confianza")
                        }
                    }
                }
            }
        }).promise();
       
        await rekognition.detectText(paramsT, function (err, dataT) {
            let datasT = JSON.parse(JSON.stringify(dataT));
            if (err) {
                text = ("error");
                console.log(err, err.stack);
            }
            else {
                for (x of datasT.TextDetections) {
                    if (x.DetectedText == "CC237" && x.Type == "LINE") {
                        text = (x.DetectedText);
                    }
                }
            }
        }).promise();

        const response = {
            statusCode: 200,
            body: JSON.stringify(resp.concat("text: ", text)),
        };
        return response;
    } catch (error) {
        return "error: " + error;
    }
};