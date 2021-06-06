module.exports.getDate = getDate;

function getDate() {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const date = new Date();
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const Today = day + " " + month + " " + year;
    return Today;
}

module.exports.getDay = getDay;

function getDay() {
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const date = new Date();
    const day = date.getDate();
    return day;
}


// ##################    OR       #####################

// exports.getDay = ()=> {
//     const monthNames = ["January", "February", "March", "April", "May", "June",
//         "July", "August", "September", "October", "November", "December"
//     ];
//     const date = new Date();
//     const day = date.getDate();
//     return day;
// }
