


  export class ApiFeatures{

    constructor(mongooseQuery,queryString){
        this.mongooseQuery=mongooseQuery
        this.queryString=queryString
    }

        // 1- pagenation++++++++++++++++++++++++++++++++++++++
        paganait(){
          
            let page= this.queryString * 1 || 1 ;
            if(this.queryString <=0) page=1
            let SKIP= (page-1)* 5
            this.mongooseQuery.skip(SKIP).limit(5)
            return this
        }
        //  2- filteration+++++++++++++++++++++++++++++++++++++++++++ 
        filter(){
           

            let fileterObj= {...this.queryString} 
         
            //(to delate propert from object)=> delete fileterObj.page or delete fileterObj['page']
            let excloudeFilter= ['sort','keyword','page','fields'];
            excloudeFilter.forEach( (qury) => {
                delete fileterObj[qury]  
            })
     
            // to handel less than and greater than {price :{$gte:20}}
            fileterObj=JSON.stringify(fileterObj);
            fileterObj= fileterObj.replace(/\b(gt|gte|lt|lte)\b/g ,match=>`$${match}`)
            fileterObj= JSON.parse(fileterObj);
            this.mongooseQuery.find(fileterObj);
            return this
        }
            //  3-sory+++++++++++++++++++++++++++++++++++++++++++++++++++++++ 
        sort(){

    if(this.queryString.sort){
     
        /**
         *sort (price sold ) so c.log(this.queryString.sort)== "price,sold"
         and this incorrect so make split to use method sort()
         */   
let sortedBy= this.queryString.sort.split(",").join(" ")
      this.mongooseQuery.sort(sortedBy)
    }
    return this
        }
//      4-search+++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        search(){
       
        if(this.queryString.keyword){  
            /**
             * keyword=clothes
             * search mean that(to search by any word exist in title or description )
             *  */ 
        this.mongooseQuery.find(
                {
                    $or:
                    [
                        { title: { $regex:this.queryString.keyword , $options:'i'}},
                        {descryption: { $regex:this.queryString.keyword , $options:'i'}}
                    ]
                }
            )
        }

        return this
        }
   //  3-select+++++++++++++++++++++++++++++++++++++++++++++++++++++++ 
        select(){
         
        if(this.queryString.fields){
        
            /**
            *fields= title,pric
            this mean get all products with deatails (just titie and descriptin)
            * fields= title,pric,_id
            this mean without (objectid)

            */   
        let selctfieldedBy= this.queryString.fields.split(",").join(" ")
        this.mongooseQuery.select(selctfieldedBy)
        }
        return this
        }
 

}