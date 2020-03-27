module.exports = async function timeout(seconds)
{
    return await(
        new Promise(
            resolve => setTimeout(resolve, 1000 * seconds)
        )
    );
}
