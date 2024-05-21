import sanityClient from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url/";

export default sanityClient({
    projectId: 'wvigk3z2',
    dataset: 'production',
    apiVersion: '2021-11-16',
    useCdn: true,
    token: 'skMqOhi596wAHIeEgtbNjMhTll8GYfw2TGPw4oizEax81LL8XuyCGIEWy4WA6HCb0ZWOFU10WrhMen3lwpX4K5IFVy88naWIftuq3p1Uoi3LZ8nsD85J86iOZeeA3L0n7NT9i7TNlB6uhuYdlfk65eOpGbR0pxFnFskYcGzSlf2pC9afvkxA',

    // projectId: 'wvigk3z2',
    // dataset: 'production', // or the name of your dataset
    // useCdn: true
})

const builder = imageUrlBuilder(sanityClient);
export const urlFor = (src) => builder.image(src) ; 