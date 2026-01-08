const Jimp = require('jimp');

(async () => {
    // Light theme icons (black lines)
    const blackSrc = 'C:/Users/wseu/.gemini/antigravity/brain/03632841-1245-49e8-be51-4eace646a8c9/skull_icon_thick_black_1767873237957.png';
    const imgBlack48 = await Jimp.read(blackSrc);
    await imgBlack48.resize(48, 48).writeAsync('icon48_light.png');
    const imgBlack128 = await Jimp.read(blackSrc);
    await imgBlack128.resize(128, 128).writeAsync('icon128_light.png');
    console.log('Created light theme icons');

    // Dark theme icons (white lines)
    const whiteSrc = 'C:/Users/wseu/.gemini/antigravity/brain/03632841-1245-49e8-be51-4eace646a8c9/skull_icon_thick_white_1767873252107.png';
    const imgWhite48 = await Jimp.read(whiteSrc);
    await imgWhite48.resize(48, 48).writeAsync('icon48_dark.png');
    const imgWhite128 = await Jimp.read(whiteSrc);
    await imgWhite128.resize(128, 128).writeAsync('icon128_dark.png');
    console.log('Created dark theme icons');

    // Default icons (use dark theme as default since Chrome toolbar is usually dark)
    await (await Jimp.read(whiteSrc)).resize(48, 48).writeAsync('icon48.png');
    await (await Jimp.read(whiteSrc)).resize(128, 128).writeAsync('icon128.png');
    console.log('Created default icons');

    console.log('Done!');
})();
