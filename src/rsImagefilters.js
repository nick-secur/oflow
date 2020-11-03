/**
 * Denoise filter.
 *
 *
 * @param src ~~ input parameter (an image data object)
 * @param dst ~~ output parameter (an image data object to write filer results)
 * @param width
 * @param height
 * @param numChannels ~~ number of color channels in image (e.g., rgba = 4)
 */
function denoise(src, dst, width, height, numChannels) {

    for (let row = 1; row < height - 1; row++) {
        for (let col = 1; col < width - 1; col++) {
            let pixel = [];
            for (let channel = 0; channel < 3; channel++) {
                let val = [];

                val[0] = src.data[((row - 1) * width + (col - 1)) * numChannels + channel];
                val[1] = src.data[((row - 1) * width + col) * numChannels + channel];
                val[2] = src.data[((row - 1) * width + (col + 1)) * numChannels + channel];

                val[3] = src.data[(row * width + (col - 1)) * numChannels + channel];
                val[4] = src.data[(row * width + col) * numChannels + channel];
                val[5] = src.data[(row * width + (col + 1)) * numChannels + channel];

                val[6] = src.data[((row + 1) * width + (col - 1)) * numChannels + channel];
                val[7] = src.data[((row + 1) * width + col) * numChannels + channel];
                val[8] = src.data[((row + 1) * width + (col + 1)) * numChannels + channel];

                let sortArr = val.sort();

                pixel[channel] = sortArr[4];
            }

            dst.data[(row * width + col) * numChannels + 0] = pixel[0] + src.data[(row * width + col) * numChannels + 0];
            dst.data[(row * width + col) * numChannels + 1] = pixel[1] + src.data[(row * width + col) * numChannels + 1];
            dst.data[(row * width + col) * numChannels + 2] = pixel[2] + src.data[(row * width + col) * numChannels + 2];
        }
    }
}

function sharpen(src, dst, width, height, numChannels) {

    for (let row = 1; row < height - 1; row++) {
        for (let col = 1; col < width - 1; col++) {
            let pixel = [];
            for (let channel = 0; channel < 3; channel++) {
                let val = 0;

                val = val + src.data[((row - 1) * width + (col - 1)) * numChannels + channel] * -1;
                val = val + src.data[((row - 1) * width + col) * numChannels + channel] * -1;
                val = val + src.data[((row - 1) * width + (col + 1)) * numChannels + channel] * -1;

                val = val + src.data[(row * width + (col - 1)) * numChannels + channel] * -1;
                val = val + src.data[(row * width + col) * numChannels + channel] * 9;
                val = val + src.data[(row * width + (col + 1)) * numChannels + channel] * -1;

                val = val + src.data[((row + 1) * width + (col - 1)) * numChannels + channel] * -1;
                val = val + src.data[((row + 1) * width + col) * numChannels + channel] * -1;
                val = val + src.data[((row + 1) * width + (col + 1)) * numChannels + channel] * -1;

                pixel[channel] = Math.round(val / 9);
            }


            dst.data[(row * width + col) * numChannels + 0] = pixel[0] + src.data[(row * width + col) * numChannels + 0];
            dst.data[(row * width + col) * numChannels + 1] = pixel[1] + src.data[(row * width + col) * numChannels + 1];
            dst.data[(row * width + col) * numChannels + 2] = pixel[2] + src.data[(row * width + col) * numChannels + 2];
        }
    }
}


module.exports = {
    denoise,
    sharpen,
};