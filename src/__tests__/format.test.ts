import {sizeBand,rangeText} from '../utils/format';
const breed=(kg:number)=>({id:'1',type:'breed' as const,attributes:{name:'Test',male_weight:{min:kg,max:kg}}});
test('size buckets are derived from weight',()=>{expect(sizeBand(breed(5))).toBe('Small');expect(sizeBand(breed(20))).toBe('Medium');expect(sizeBand(breed(35))).toBe('Large');expect(sizeBand(breed(50))).toBe('Giant');});
test('range formatter handles partial ranges',()=>{expect(rangeText({min:1,max:3})).toBe('1–3');expect(rangeText({min:2})).toBe('2');expect(rangeText()).toBe('—');});
