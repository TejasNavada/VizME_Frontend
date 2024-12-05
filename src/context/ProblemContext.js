import React, { useEffect, useState } from "react";
import pic from "../icon/138.png"
import {getVariablesByProblemId, getAllProblems, subscribeProblem, subscribeProblems } from "../service/problemService"
const fs = require('fs');


export const ProblemContext = React.createContext();

export const ProblemProvider = ({ children}) => {
	const [problem, setProblem] = useState(null);
	const [problemId, setProblemId] = useState(0);
	const [problems, setProblems] = useState([])
        // {
        //     name: "Problem 2.1",
        //     image: "https://jrgrohs.github.io/StrengthOfMaterialsExercises/images/138.png",
        //     statement: 'A series of solid circular bars are loaded with three loads as shown, F1 = var0 N, F2 = var1 N, and F3 = var2 N. What is the largest absolute normal stress in any bar?\n\nYour Answer in units of MPa',
        //     answer: "(var0/(PI*(d2/(1000*2))**2))/10**6",
        //     variables:[
        //         {
        //             name:"var0",
        //             min:50,
        //             max:70,
        //             step: 1
        //         },
        //         {
        //             name:"var1",
        //             min:10,
        //             max:30,
        //             step: 1
        //         },
        //         {
        //             name:"var2",
        //             min:10,
        //             max:30,
        //             step: 1
        //         },
        //         {
        //             name:"d1",
        //             min:8,
        //             max:8,
        //             step: 1
        //         },
        //         {
        //             name:"d2",
        //             min:6,
        //             max:6,
        //             step: 1
        //         },
        //         {
        //             name:"d3",
        //             min:10,
        //             max:10,
        //             step: 1
        //         }
                
        //     ],
        //     feedback:"The answer is 2.2635369684180673",
        //     id:1
        // },
        // {
        //     name: "Problem 2.2",
        //     image: "https://jrgrohs.github.io/StrengthOfMaterialsExercises/images/139.png",
        //     statement: 'Two cylinders are stacked on top of one another and two forces are applied at the top surface and at the joint between the cylinders as shown. If L1 = 3 in., L2 = 3.9000000000000004 in., FA = 590 lb, and FB = 290 lb, find the total deflection in the stack of cylinders. Assume E = 30 x 106 psi for both cylinders.\n\nYour Answer in units of inches',
        //     answer: .000008338304307410054,
        //     variables:[],
        //     feedback:"The answer is .000008338304307410054",
        //     id:2
        // },
        // {
        //     name: "Problem 2.3",
        //     image: "https://jrgrohs.github.io/StrengthOfMaterialsExercises/images/144.png",
        //     statement: 'A plastic cylindrical peg is constrained by a metal cap as shown. An axial load of F = 55 lb is applied to the peg. If d1 = 0.7 in and d2 = 1.12 in, determine the normal stress in the peg. Assume the axial load is evenly distributed across the peg and that the metal cap is fixed and does not move.\n\nYour Answer in units of psi',
        //     answer: 142.91464277639585,
        //     variables:[],
        //     feedback:"The answer is 142.91464277639585",
        //     id:3
        // },
        // {
        //     name: "Problem 2.4",
        //     image: "https://jrgrohs.github.io/StrengthOfMaterialsExercises/images/146.png",
        //     statement: 'A crate weighing 59 kN is suspended by a set of cables. The diameter of each cable is 4.6 mm. What is the maximum stress in any cable, exluding the cable attached to the crate.\n\nYour Answer in units of GPa',
        //     answer: 3.1829756812019854,
        //     variables:[],
        //     feedback:"The answer is 3.1829756812019854",
        //     id:4
        // },
        // {
        //     name: "Problem 2.47",
        //     image: "https://jrgrohs.github.io/StrengthOfMaterialsExercises/images/153.png",
        //     statement: 'Two slanted brackets are glued together as shown. If F = 490 lb, L = 5.8 in., and Θ = 18 °, determine the shear stress parallel to the inclined plane. Assume loads are inline and there is no rotation.\n\nYour Answer in units of psi',
        //     answer: 13.05330407273484865,
        //     variables:[],
        //     feedback:"The answer is 13.05330407273484865",
        //     id:5
        // },
        // {
        //     name: "Problem 2.48",
        //     image: "https://jrgrohs.github.io/StrengthOfMaterialsExercises/images/156.png",
        //     statement: 'A 2 inch thick board is cut and then glued back together along a line that is Θ = 13 ° off the vertical as shown. If height h = 12.6 in. and F = 4900 lb, determine the normal stress along the cut line.\n\nYour Answer in units of psi',
        //     answer: 184.60497672353014,
        //     variables:[],
        //     feedback:"The answer is 184.60497672353014",
        //     id:6
        // },
        // {
        //     name: "Problem 4.37 ",
        //     image: "https://jrgrohs.github.io/StrengthOfMaterialsExercises/images/157.png",
        //     statement: 'A small truss is constructed with solid square wood members and subjected to a load of F = 44 kN. Determine the minimum dimension, a, of the member so that the truss will have a factor of safety of 3.4. All members have the same cross-section. The wood has a failure stress of \u03C3fail = 46 MPa.\n\nYour Answer in units of centimeters',
        //     answer: 5.702783454632902,
        //     variables:[],
        //     feedback:"The answer is 5.702783454632902",
        //     id:7
        // },
        // {
        //     name: "Problem 2.21",
        //     image: "https://jrgrohs.github.io/StrengthOfMaterialsExercises/images/164.png",
        //     statement: 'A double lap joint is glued together using glue with a shear stress failure strength of 8400 psi. If dimensions L = 7.8 in. and t = 5.3 in., what is the maximum load P that the joint can withstand? Assume the load is evenly distributed across the joint on both sides.\n\nYour Answer in units of kips',
        //     answer: 694.5119999999998,
        //     variables:[],
        //     feedback:"The answer is 694.5119999999998",
        //     id:8
        // },
        // {
        //     name: "Problem 2.22",
        //     image: "https://jrgrohs.github.io/StrengthOfMaterialsExercises/images/165.png",
        //     statement: 'A bracket is attached to a wall with two circular rivets of diameter d = 29 mm. A load F = 88 kN is applied in the center of the bracket. Assuming the load is split evenly between the two rivits, determine the shear stress in each rivet.\n\nYour Answer in units of MPa',
        //     answer: 66.61419734642942,
        //     variables:[],
        //     feedback:"The answer is 66.61419734642942",
        //     id:9
        // },
        // {
        //     name: "Problem 2.38",
        //     image: "https://jrgrohs.github.io/StrengthOfMaterialsExercises/images/166.png",
        //     statement: 'A crate of weight 6900 = lb hangs from a solid circular metal rod of diameter 2.4 = in.. The cable is wrapped around a support collar of diameter 7.199999999999999 = in. and thickness 4.8 = in. to evenly distribute the cable load. What is the bearing stress on the support collar due to the rod?\n\nYour Answer in units of ksi',
        //     answer: 0.5989583333333334,
        //     variables:[],
        //     feedback:"The answer is 0.5989583333333334",
        //     id:10
        // }
	const [ mode, setMode ] = useState(0)
    const [feedback,setFeedback] = useState(false)
    const [variables, setVariables] = useState([])
    
    useEffect(()=>{
        getAllProblems().then((probs)=>{
            console.log(probs)
            setProblems(probs)
            setProblem(probs[0])
            subscribeProblems(setProblems)
        }) 

    },[])

    useEffect(()=>{
        if(problem?.problemId!=null && problemId!=problem?.problemId){
            console.log(problem?.problemId)
            setProblemId(problem?.problemId)
            getVariablesByProblemId(problem.problemId).then((vars)=>{
                console.log(vars)
                setVariables(vars)
            })
            return subscribeProblem(problem?.problemId, setProblem)
        }

    },[problem])


	

	

	return (
		<ProblemContext.Provider value={{ problem, setProblem, problems, setProblems, mode, setMode, feedback, setFeedback, variables, setVariables }}>
			{children}
		</ProblemContext.Provider>
	);
};
