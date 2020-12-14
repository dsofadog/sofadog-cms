import React, { useState } from "react";
import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";

const DescriptionInputs = ({idx, descriptionState, handleDescriptionsChange}) => {
  
  const sentence1 = `sentence1-${idx}`;
  const sentence2 = `sentence2-${idx}`;
  const sentence3 = `sentence3-${idx}`;
  const sentencesMode = {sentence1: false ,sentence2 : false,sentence3:false};
  const [editModeSentences, seteditModeSentences] = useState(sentencesMode);

  function editSentenceData(sentencedata,value){
    sentencesMode[sentencedata] = value;    
    console.log(sentencesMode);
    seteditModeSentences(sentencesMode);
    console.log(editModeSentences,"editModeSentences");
  
  }

  function addSentence(){
      if(descriptionState[idx].sentence2 ==""){
        sentencesMode.sentence2 = true;  
      }else{
        sentencesMode.sentence3 = true;
      }
      seteditModeSentences(sentencesMode);
  }

  function removeSentenceData(sentenceData){
      alert(sentenceData);
    descriptionState[idx][sentenceData] = "";
    console.log(descriptionState[idx]);
    sentencesMode.sentence = false;
    seteditModeSentences(sentencesMode);
  }

  return (
    <>           
        {descriptionState[idx].sentence1 !="" &&   !editModeSentences.sentence1  && (
              <div className="w-full flex items-center space-x-3 px-3">
              <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
              <div className="w-11/12 truncate hover:text-gray-600 text-xs">
                                                 <span>
                                                 { editModeSentences.sentence1}
                                                 {descriptionState[idx].sentence1}
                                               </span>
                                               </div>
        <div className="w-1/12 text-xs text-gray-600 flex space-x-2 justify-end">
          <FontAwesomeIcon
            className="w-5 cursor-pointer hover:text-blue-600"
            icon={["fas", "edit"]}
            onClick={() => editSentenceData("sentence1",true)}
          />
          <FontAwesomeIcon
            className="w-3.5 cursor-pointer hover:text-red-800"
            icon={["fas", "trash-alt"]}
            onClick={() => removeSentenceData("sentence1")}
          />
        </div>
      </div>
                                            )}


{ editModeSentences.sentence1  && (
               <div className="w-full flex items-center space-x-3 px-3">
               <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500">
                   { editModeSentences.sentence1}
               </div>
               <div className="w-11/12 mt-1 relative rounded-md shadow-sm">
                 <input            
                   className="form-input block w-full text-xs sm:leading-3"
                   placeholder="Enter sentence"
                   type="text"
                   name={sentence1}
                   data-idx={idx}
                   data-classx="sentence1" 
                   id={sentence1}          
                   value={descriptionState[idx].sentence1}
                   onChange={handleDescriptionsChange}
                   placeholder="Enter sentence"
                 />
               </div>
               <div className="w-1/12 text-xs text-gray-600 flex space-x-2 justify-end">
                 <FontAwesomeIcon
                   className="w-5 cursor-pointer hover:text-white rounded-full bg-gray-300 hover:bg-green-500 p-1"
                   icon={["fas", "check"]}
                   onClick={() => editSentenceData("sentence1",false)}
                 />
                 <FontAwesomeIcon
                   className="w-3.5 cursor-pointer hover:text-red-800"
                   icon={["fas", "trash-alt"]}
                   onClick={() => removeSentenceData("sentence1")}
                 />
               </div>
             </div>
                                            )}
         
        
  





                                             {/* second sentences  */}

      {descriptionState[idx].sentence2 !="" &&   !editModeSentences.sentence2  && (
              <div className="w-full flex items-center space-x-3 px-3">
              <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
              <div className="w-11/12 truncate hover:text-gray-600 text-xs">
                                                 <span>
                                                 {descriptionState[idx].sentence2}
                                               </span>
                                               </div>
        <div className="w-1/12 text-xs text-gray-600 flex space-x-2 justify-end">
          <FontAwesomeIcon
            className="w-5 cursor-pointer hover:text-blue-600"
            icon={["fas", "edit"]}
            onClick={() => editSentenceData("sentence2",true)}
          />
          <FontAwesomeIcon
            className="w-3.5 cursor-pointer hover:text-red-800"
            icon={["fas", "trash-alt"]}
            onClick={() => removeSentenceData("sentence2")}
          />
        </div>
      </div>
                                            )}


{ editModeSentences.sentence2 && (
               <div className="w-full flex items-center space-x-3 px-3">
               <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
               <div className="w-11/12 mt-1 relative rounded-md shadow-sm">
                 <input            
                   className="form-input block w-full text-xs sm:leading-3"
                   placeholder="Enter sentence"
                   type="text"
                   name={sentence2}
                   data-idx={idx}
                   data-classx="sentence2" 
                   id={sentence1}          
                   value={descriptionState[idx].sentence2}
                   onChange={handleDescriptionsChange}
                   placeholder="Enter sentence"
                 />
               </div>
               <div className="w-1/12 text-xs text-gray-600 flex space-x-2 justify-end">
                 <FontAwesomeIcon
                   className="w-5 cursor-pointer hover:text-white rounded-full bg-gray-300 hover:bg-green-500 p-1"
                   icon={["fas", "check"]}
                   onClick={() => editSentenceData("sentence2",false)}
                 />
                 <FontAwesomeIcon
                   className="w-3.5 cursor-pointer hover:text-red-800"
                   icon={["fas", "trash-alt"]}
                   onClick={() => removeSentenceData("sentence2")}
                 />
               </div>
             </div>
                                            )}

    
        {/* third sentences  */}

        {descriptionState[idx].sentence3 !="" &&   !editModeSentences.sentence3  && (
              <div className="w-full flex items-center space-x-3 px-3">
              <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
              <div className="w-11/12 truncate hover:text-gray-600 text-xs">
                                                 <span>
                                                 {descriptionState[idx].sentence3}
                                               </span>
                                               </div>
        <div className="w-1/12 text-xs text-gray-600 flex space-x-2 justify-end">
          <FontAwesomeIcon
            className="w-5 cursor-pointer hover:text-blue-600"
            icon={["fas", "edit"]}
            onClick={() => editSentenceData("sentence3",true)}
          />
          <FontAwesomeIcon
            className="w-3.5 cursor-pointer hover:text-red-800"
            icon={["fas", "trash-alt"]}
            onClick={() => removeSentenceData("sentence3")}
          />
        </div>
      </div>
                                            )}


{ editModeSentences.sentence3 && (
               <div className="w-full flex items-center space-x-3 px-3">
               <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
               <div className="w-11/12 mt-1 relative rounded-md shadow-sm">
                 <input            
                   className="form-input block w-full text-xs sm:leading-3"
                   placeholder="Enter sentence"
                   type="text"
                   name={sentence3}
                   data-idx={idx}
                   data-classx="sentence3" 
                   id={sentence3}          
                   value={descriptionState[idx].sentence3}
                   onChange={handleDescriptionsChange}
                   placeholder="Enter sentence"
                 />
               </div>
               <div className="w-1/12 text-xs text-gray-600 flex space-x-2 justify-end">
                 <FontAwesomeIcon
                   className="w-5 cursor-pointer hover:text-white rounded-full bg-gray-300 hover:bg-green-500 p-1"
                   icon={["fas", "check"]}
                   onClick={() => editSentenceData("sentence3",false)}
                 />
                 <FontAwesomeIcon
                   className="w-3.5 cursor-pointer hover:text-red-800"
                   icon={["fas", "trash-alt"]}
                   onClick={() => removeSentenceData("sentence3")}
                 />
               </div>
             </div>
                                            )}
         
        
     
      <div className="flex items-center space-x-3 px-3">
        <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
        <button  onClick={() => addSentence()} className="text-white px-2 py-1 bg-indigo-600 rounded text-xs">
          + Add Sentence
        </button>
      </div>
    </>

    // <div className="w-full" key={`description-${idx}`}>
    //     <div className="w-full">
    //         <label htmlFor="first_name" className="block text-xs font-medium leading-5 text-gray-700">1. Sentence</label>
    //         <input
    //             type="text"
    //             name={sentence1}
    //             data-idx={idx}
    //             data-classx="sentence1"
    //             id={sentence1}
    //             className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
    //             value={descriptionState[idx].sentence1}w
    //             onChange={handleDescriptionsChange}
    //             placeholder="Enter sentence"
    //         />
    //     </div>
    //     <div className="w-full">
    //         <label htmlFor="first_name" className="block text-xs font-medium leading-5 text-gray-700">2. Sentence</label>
    //         <input
    //             type="text"
    //             name={sentence2}
    //             data-idx={idx}
    //             data-classx="sentence2"
    //             id={sentence2}
    //             className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
    //             value={descriptionState[idx].sentence2}
    //             onChange={handleDescriptionsChange}
    //             placeholder="Enter sentence"
    //         />
    //     </div>
    //     <div className="w-full">
    //         <label htmlFor="first_name" className="block text-xs font-medium leading-5 text-gray-700">3. Sentence</label>
    //         <input
    //             type="text"
    //             name={sentence3}
    //             data-idx={idx}
    //             data-classx="sentence3"
    //             id={sentence3}
    //             className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
    //             value={descriptionState[idx].sentence3}
    //             onChange={handleDescriptionsChange}
    //             placeholder="Enter sentence"
    //         />
    //     </div>
    // </div>
  );
};

DescriptionInputs.propTypes = {
  idx: PropTypes.number,
  descriptionState: PropTypes.array,
  handleDescriptionsChange: PropTypes.func,
};

export default DescriptionInputs;
