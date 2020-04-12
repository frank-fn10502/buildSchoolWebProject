var dataList = [];
function convertData(tempData){
    let data = {
        id : '',
        coordinates: '',
        name: '',
        masksLeft:[],//[大人 ,小孩]
    }
    data.id = tempData.properties.id;
    data.coordinates = tempData.geometry.coordinates;
    data.name = tempData.properties.name;
    data.masksLeft.push(tempData.properties.masksLeft);
    data.masksLeft.push(tempData.properties.childMasksLeft);
    
    dataList.push(data);
}



