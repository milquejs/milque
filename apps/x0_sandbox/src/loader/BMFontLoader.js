/**
 * @typedef BMFontChar
 * @property {number} id The character id.
 * @property {number} x The left position of the character image in the texture.
 * @property {number} y The top position of the character image in the texture.
 * @property {number} width The width of the character image in the texture.
 * @property {number} height The height of the character image in the texture.
 * @property {number} xoffset How much the current position should be offset when
 *                            copying the image from the texture to the screen.
 * @property {number} yoffset How much the current position should be offset when
 *                            copying the image from the texture to the screen.
 * @property {number} xadvance How much the current position should be advanced
 *                             after drawing the character.
 * @property {number} page The texture page where the character image is found.
 * @property {number} chnl The texture channel where the character image is
 *                         found (1 = blue, 2 = green, 4 = red, 8 = alpha,
 *                         15 = all channels).
 * 
 * @typedef BMFontKerning
 * @property {number} first The first character id.
 * @property {number} second The second character id.
 * @property {number} amount How much the x position should be adjusted when
 *                           drawing the second character immediately following
 *                           the first.
 * 
 * @typedef BMFontData
 * @property {object} info              This tag holds information on how the
 *                                      font was generated.
 * @property {string} info.face         This is the name of the true type font.
 * @property {number} info.size         The size of the true type font.
 * @property {number} info.bold         The font is bold.
 * @property {number} info.italic	    The font is italic.
 * @property {string} info.charset	    The name of the OEM charset used (when
 *                                      not unicode).
 * @property {number} info.unicode	    Set to 1 if it is the unicode charset.
 * @property {number} info.stretchH	    The font height stretch in percentage.
 *                                      100% means no stretch.
 * @property {number} info.smooth	    Set to 1 if smoothing was turned on.
 * @property {number} info.aa	        The supersampling level used. 1 means no
 *                                      supersampling was used.
 * @property {number} info.padding	    The padding for each character
 *                                      (up, right, down, left).
 * @property {number} info.spacing	    The spacing for each character
 *                                      (horizontal, vertical).
 * @property {number} info.outline	    The outline thickness for the characters.
 * @property {object} common            This tag holds information common to all
 *                                      characters.
 * @property {number} common.lineHeight This is the distance in pixels between
 *                                      each line of text.
 * @property {number} common.base	    The number of pixels from the absolute
 *                                      top of the line to the base of the characters.
 * @property {number} common.scaleW	    The width of the texture, normally used
 *                                      to scale the x pos of the character image.
 * @property {number} common.scaleH	    The height of the texture, normally used
 *                                      to scale the y pos of the character image.
 * @property {number} common.pages	    The number of texture pages included in
 *                                      the font.
 * @property {number} common.packed	    Set to 1 if the monochrome characters
 *                                      have been packed into each of the texture
 *                                      channels. In this case alphaChnl describes
 *                                      what is stored in each channel.
 * @property {number} common.alphaChnl	Set to 0 if the channel holds the glyph data,
 *                                      1 if it holds the outline,
 *                                      2 if it holds the glyph and the outline,
 *                                      3 if its set to zero, and 4 if its set to one.
 * @property {number} common.redChnl	Set to 0 if the channel holds the glyph data,
 *                                      1 if it holds the outline,
 *                                      2 if it holds the glyph and the outline,
 *                                      3 if its set to zero, and 4 if its set to one.
 * @property {number} common.greenChnl	Set to 0 if the channel holds the glyph data,
 *                                      1 if it holds the outline,
 *                                      2 if it holds the glyph and the outline,
 *                                      3 if its set to zero, and 4 if its set to one.
 * @property {number} common.blueChnl	Set to 0 if the channel holds the glyph data,
 *                                      1 if it holds the outline,
 *                                      2 if it holds the glyph and the outline,
 *                                      3 if its set to zero, and 4 if its set to one.
 * @property {object} page              This tag gives the name of a texture
 *                                      file. There is one for each page in the font.
 * @property {number} page.id	        The page id.
 * @property {number} page.file	        The texture file name.
 * @property {Array<BMFontChar>} chars  This tag describes characters in the font.
 *                                      There is one for each included character
 *                                      in the font.
 * @property {Array<BMFontKerning>} kernings The kerning information is used to adjust
 *                                           the distance between certain characters,
 *                                           e.g. some characters should be placed
 *                                           closer to each other than others.
 */

/**
 * @param {string} src 
 * @returns {BMFontData}
 */
export async function loadBMFont(src)
{
    if (typeof src === 'string')
    {
        const response = await fetch(src);
        const arrayBuffer = await response.arrayBuffer();
        return loadBMFont(arrayBuffer);
    }
    else if (!(src instanceof ArrayBuffer || ArrayBuffer.isView(src)))
    {
        throw new Error(
            'Cannot load from source - must be '
            + 'an array buffer or fetchable url');
    }
    /** @type {ArrayBuffer} */
    const arrayBuffer = src;
    return parse(new TextDecoder().decode(arrayBuffer));
}

const TAG_PATTERN = /(.+?)\s+(.*)/;
const LINE_PATTERN = /(.+)=(.+)/;

/**
 * @param {string} string 
 * @returns {BMFontData}
 */
function parse(string)
{
    let lines = string.split('\n');
    let info = {};
    let common = {};
    let page = {};
    let chars = [];
    let kernings = [];
    for(let line of lines) {
        let array = TAG_PATTERN.exec(line);
        if (!array) {
            continue;
        }
        let [_, tag, props] = array;
        switch(tag) {
            case 'info':
                parseBMLine(info, props);
                break;
            case 'common':
                parseBMLine(common, props);
                break;
            case 'page':
                parseBMLine(page, props);
                break;
            case 'chars':
                // This only has count info. Ignore it.
                break;
            case 'char':
                let char = {};
                parseBMLine(char, props);
                if ('id' in char) {
                    chars.push(char);
                }
                break;
            case 'kerning':
                let kerning = {};
                parseBMLine(kerning, props);
                if ('first' in kerning) {
                    kernings.push(kerning);
                }
                break;
            default:
                // Unknown tag.
        }
    }
    let data = {
        info,
        common,
        page,
        chars,
        kernings,
    };
    console.log(data);
    return data;
}

function parseBMLine(out, line) {
    let props = line.split(/\s+/);
    for(let prop of props) {
        let array = LINE_PATTERN.exec(prop);
        if (!array) {
            continue;
        }
        let [_, key, value] = array;
        let result = JSON.parse(`[${value}]`);
        if (result.length === 1) {
            out[key] = result[0];
        } else {
            out[key] = result;
        }
    }
}
