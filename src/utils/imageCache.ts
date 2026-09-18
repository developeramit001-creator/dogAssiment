import RNFS from 'react-native-fs';
const DIR=`${RNFS.CachesDirectoryPath}/tripare-images`; const MAX_BYTES=50*1024*1024;
async function ensure(){if(!(await RNFS.exists(DIR))) await RNFS.mkdir(DIR);}
const key=(url:string)=>`${url.replace(/[^a-zA-Z0-9]/g,'_').slice(-100)}.jpg`;
export async function cachedPath(url:string){await ensure(); const path=`${DIR}/${key(url)}`; return (await RNFS.exists(path))?`file://${path}`:null;}
export async function cacheImage(url:string){await ensure(); const path=`${DIR}/${key(url)}`; if(await RNFS.exists(path)) return `file://${path}`; try{await RNFS.downloadFile({fromUrl:url,toFile:path}).promise; await enforceLimit(); return `file://${path}`;}catch{return url;}}
async function enforceLimit(){const files=await RNFS.readDir(DIR); let total=files.reduce((n,f)=>n+(Number(f.size)||0),0); if(total<=MAX_BYTES)return; const sorted=files.sort((a,b)=>(Number(a.mtime||0)-Number(b.mtime||0))); for(const f of sorted){if(total<=MAX_BYTES)break; const s=Number(f.size)||0; await RNFS.unlink(f.path); total-=s;}}
