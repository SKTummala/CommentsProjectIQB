import React, { useState, useEffect } from "react";


function Comments() {
  let [data, setData] = useState([]);
  let [userInputaction, setUserInputaction] = useState({numberofrowslimit: 10,pagenumber: 1,orderbyfield: "id",orderbyType: "asc",  }); 
  let [searchkeyword,SetsearchKeyword] = useState(' ')
  let [counter, setCounter] = useState(0);
  //pagination attributes  to use with first,previous,next,last page links
  let [paginationdetails, setPaginationdetails] = useState({numberofrecords: null,startIndex: null,endIndex: null,firstpagenumber: null,nextpagenumber: null,Prevpagenumber: null,lastpagenumber: null, });
  let [comment,setComment] = useState("")
  
  // to get the entered value and update the state of an attribute in request body
  function getData(e) {
    setUserInputaction({ ...userInputaction, [e.target.name]: e.target.value });
  }
  // to change the order by (ascending/descending ) otherwise  
  function orderType() {
    setUserInputaction({...userInputaction,["orderbyType"]:userInputaction.orderbyType == "asc" ? "desc": userInputaction.orderbyType == "desc" ? "asc" : ""});
  }

  //API call with post method 
  async function postComment() {
    const rawResponse = await fetch("http://127.0.0.1:3001/v1/api/comments", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({comment}),
    });

    const content = await rawResponse.json();
    
    setCounter(counter + 1); // incrementing the counter on posting the new comment and using it in useeffect dependency to re-render
    document.activeElement.blur(); 
    // resetting the comments field
    setComment("")
    const updatedCommentsArray = [...data, content];
    
    setData(updatedCommentsArray); // setting/updating the data ..so that the new comments gets included in the loop and displayed in html table
    
  }

    useEffect(() => {
      
        async function GetcommentsAPICall() {
          
          let search =  searchkeyword 
          let {numberofrowslimit,pagenumber} = userInputaction ;

          let apiresponce = await fetch(`http://127.0.0.1:3001/v1/api/comments?search=` + search + `&rowsperpage=` + numberofrowslimit + "&page=" + pagenumber + "&orderby=" +  userInputaction.orderbyfield + "&orderbytype=" +  userInputaction.orderbyType );
          let apioutput = await apiresponce.json();
          //updating pagination state according to new result set 
          setPaginationdetails((paginationdetails) => ({...paginationdetails,...apioutput.paginationdetails,}));
          //updating result state state according to new result set 
          
          
          setData(apioutput.results);
          
        }
         GetcommentsAPICall();
    
    }, [counter,userInputaction]);

return (
  <>
  <div className="container">
      <br/>
        <h2> Comments Page  </h2>
      <div className="col" style={{ textAlign: "left" }}>
        <input type="text" id="searchInput" name="search" onChange={(e) => { SetsearchKeyword( (String(e.target.value).length > 0 ? e.target.value : ' ' )    );setUserInputaction({ ...userInputaction,["pagenumber"]: 1 }); }}  placeholder="Search.." />
      </div>
      <br />

          
            <div className="container-fluid" style={{ height: "500px", overflow: "auto" }} >
            <br />

            <table id="commentsTable" className="table">
              <thead >
                <tr>
                  <th className="col-4 "  onClick={() => {setUserInputaction({ ...userInputaction, ["orderbyfield"]: "id" });orderType(); }} > ID </th>
                  <th className="col-4 "  onClick={() => {setUserInputaction({ ...userInputaction, ["orderbyfield"]: "comment" });orderType();}} > Comment </th>
                  <th className="col-4 "  onClick={() => { setUserInputaction({...userInputaction,["orderbyfield"]: "created_at", });orderType();}} > Commented on </th>
                </tr>
              </thead>
              <tbody>
                {paginationdetails.numberofrecords > 0  && data.map((i) => (
                  <tr key={i.id}>
                    <td className="col-4 ">{i.id}</td>
                    <td className="col-4 ">{i.comment}</td>
                    <td className="col-4 ">{i.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>

                    
          </div>
          
          <br />
          <div className="row" style={{ textAlign: "left" }}>  
              <label for="maxRows" className="col" > Show              
                <span> <select  className="col" name="numberofrowslimit" id="maxRows" style={{ borderLeft: "none",borderRight: "none" ,   borderTop: "none" , borderBottom: "0.5px solid black"}} onChange={(e) => { setUserInputaction({ ...userInputaction,["pagenumber"]: 1,[e.target.name]: e.target.value, });}} >
                    <option value="5">5</option>
                    <option value="10" selected> 10 </option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="70">70</option>
                    <option value="100">100</option>
                </select>
                </span> rows 
            </label>
            <span className="col-3" style={{ textAlign: "center" }}> 
                  
              Showing {paginationdetails.numberofrecords == 0 ? 0 : paginationdetails.startIndex == 0 ? 1 : paginationdetails.startIndex} to {paginationdetails.endIndex} of {paginationdetails.numberofrecords} rows 

            </span>
            <span className="col-2" > Jump to   <input type="number" min="1" max={paginationdetails.lastpagenumber} className="col-3" style={{ borderLeft: "none",borderRight: "none" ,   borderTop: "none" , borderBottom: "0.5px solid black"}}  id="pagenumber" name="pagenumber"  
              value = { paginationdetails.numberofrecords > 0 ? userInputaction.pagenumber : 0  }  
                onChange = {(e) => {e.preventDefault();  setUserInputaction({ ...userInputaction, ["pagenumber"]:   (   (e.target.value <= paginationdetails.lastpagenumber ? e.target.value : paginationdetails.lastpagenumber) ) }) } }
                />  / {paginationdetails.lastpagenumber} Pages
            </span>

            <span className="col" style={{ textAlign: "right" }}>
              <button type="submit" className="btn btn-link " id="First"  onClick={(e) => { e.preventDefault(); setUserInputaction({ ...userInputaction, ["pagenumber"]: 1 });  }} disabled={paginationdetails.Prevpagenumber > 0 ? "" : "disabled"}>
                  First
                </button>
                <button type="submit" className="btn btn-link " id="Previuos" onClick={(e) => { e.preventDefault(); setUserInputaction({ ...userInputaction,["pagenumber"]: userInputaction.pagenumber - 1,});}} disabled={paginationdetails.Prevpagenumber > 0 ? "" : "disabled"}>
                  Previous
                </button>
                <button type="submit" className="btn btn-link " id="Next" onClick={(e) => { e.preventDefault(); setUserInputaction({...userInputaction,["pagenumber"]: userInputaction.pagenumber + 1, });}} disabled={paginationdetails.nextpagenumber > 0 ? "" : "disabled"}>
                  Next
                </button>
                <button type="submit" className="btn btn-link " id="Last" onClick={(e) => {e.preventDefault();setUserInputaction({...userInputaction,["pagenumber"]: Math.ceil(paginationdetails.numberofrecords / userInputaction.numberofrowslimit ),});}} disabled={paginationdetails.nextpagenumber > 0 ? "" : "disabled"}>
                  Last
                </button>
            </span>
          </div>
        
          <br />
          <textarea type="text" className="form-control" id="addcomment" name="comment"  value = {comment} placeholder="Type your comments (Max 1000 characters)" onChange = {(e) => setComment(e.target.value) } maxlength="1000" > </textarea>
          
          <br />
          <button type="submit" className="btn btn-dark " id="savecomment" onClick={postComment} disabled={ !comment ? "disabled" : ""} > Add </button>


  </div>
      </>
    );
  }


export default Comments;
