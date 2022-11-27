const {MoveTo, Move, suction, getState} = require("./http-API")
const fs = require("fs")

 const dock_file_path = "dock.json" 
var data = JSON.parse(fs.readFileSync(dock_file_path))
const package_height = 12
const Load_location = {x:100, y:-100}
const Unload_location = {x:150, y:0}
const reset_location = {x:0, y:-100, z:200}
const dock_location = []
/* dock_location[1] = {x:-150, y:75, storage:[{offerId: 1},{offerId:3}]}
dock_location[2] = {x:-150, y:0, storage:[{offerId:5}]}
dock_location[3] = {x:-150, y:-75, storage:[{offerId: 2}]}
dock_location[4] = {x:-150, y:-150, storage:[]} */
dock_location[1] = {x:data.dock_location1.x, y:data.dock_location1.y, storage:data.dock_location1.storage}
dock_location[2] = {x:data.dock_location2.x, y:data.dock_location2.y, storage:data.dock_location2.storage}
dock_location[3] = {x:data.dock_location3.x, y:data.dock_location3.y, storage:data.dock_location3.storage}
dock_location[4] = {x:data.dock_location4.x, y:data.dock_location4.y, storage:data.dock_location4.storage}

var temp_array = []


console.log(dock_location)
//console.log(dock_location[4].storage)
// save dock data
const save_data_to_JSON_file =async () => {
let dock = {
    dock_location1 : {x:dock_location[1].x, y:dock_location[1].y, storage:dock_location[1].storage},
    dock_location2 : {x:dock_location[2].x, y:dock_location[2].y, storage:dock_location[2].storage},
    dock_location3 : {x:dock_location[3].x, y:dock_location[3].y, storage:dock_location[3].storage},
    dock_location4 : {x:dock_location[4].x, y:dock_location[4].y, storage:dock_location[4].storage}
    }
let save_data = JSON.stringify(dock)
fs.writeFileSync(dock_file_path,save_data)
}
//save_data_to_JSON_file()


//order LOW to HIGH --> storage level
const select_storage_location = () => {
    for(var i = 1; i<=4; i++) {
        temp_array[i] =JSON.parse(JSON.stringify(dock_location[i]))
    }
    
    for(var i=1; i<=4; i++){
        for(var j = 1; j<=4-i; j++){
            if(temp_array[j].storage.length > temp_array[j+1].storage.length) {
                var temp = temp_array[j+1]
                temp_array[j+1] = temp_array[j]
                temp_array[j] = temp
            }
    }
    }
    //console.log(temp_array)
    return temp_array
}

// get index first object ordered array
const getIndex = () => {
    for(var i=1; i<=4; i++){
        if(temp_array[1].x === dock_location[i].x && 
        temp_array[1].y === dock_location[i].y){
            return i
        }
    }}
/* console.log(select_storage_location()[1])
console.log(getIndex())
console.log(dock_location[getIndex()])
console.log(dock_location) */

const storage_location = () => {
    select_storage_location()
    return getIndex()
}

//console.log(storage_location())

//console.log(select_storage_location()[1])

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


const Move_Load_location =async () => {
    await MoveTo(Load_location.x, Load_location.y, 100)
    await delay(3000)
}

const Move_Unload_location =async () => {
    MoveTo(Unload_location.x, Unload_location.y, 100 + package_height)
    await delay(3000)
}

const Move_Reset_location =async () => {
    MoveTo(reset_location.x, reset_location.y, reset_location.z)
    await delay(3000)
}

const Move_dock_location =async (i,mode) => {
    let z
    //70 -> tool height, 20 -> distance for prevention collision 
    if(mode === "load"){
        z = (dock_location[i].storage.length * package_height) + package_height + 20 + 55
}
    if(mode === "unload"){
        z = (dock_location[i].storage.length * package_height) + 53 + 20 
    }
    console.log("x: ",dock_location[i].x
                ,"y:",dock_location[i].y,
                "z:",z )
                
    MoveTo(dock_location[i].x, dock_location[i].y, z)
    await delay(3000)
} 

module.exports = {Move_Load_location, Move_Unload_location, Move_dock_location, dock_location, storage_location, Move_Reset_location, temp_array,delay,save_data_to_JSON_file,getIndex}