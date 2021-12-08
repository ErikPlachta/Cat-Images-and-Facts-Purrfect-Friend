//--    Custom JS for Purrfect Friend
//--    Author(s): Erik Plachta, 
//--    Date_Created: 12/07/2021 


/* -------------------------------------------------------------------------- */
//-- GLOBALS -> START


// For local storage DB
let database_Name = "purrfect-friend";


// Total Hours in Day
let hours_Day = 24;

// Moment JS date
const today = function() {return moment().format("dddd, MMMM Do YYYY")};

// hour in 24 hour format - hour | minute | second | miliseconds | am-pm
const time_24 = function() { return moment().format("HH:MM:SS:MS a")};
// hour in 12 hour format - hour | minute | second | miliseconds | am-pm
const time_12 = function() { return moment().format("hh:MM:SS:MS a")};

/*----------------------------------------------------------------------------*/
/*-- X --> START


    TODO:: 12/08 #EP || Define next thing to do

*/


//-- X --> END
/*----------------------------------------------------------------------------*/
/*-- DATABASE MANAGEMENT --> START
    - Manages all database related functionality with three functions. 
    - Runs all three on start.


        get_Database()
            - Use to to get the current database in JSON format.
            - Public function used anytime needes.
            - returns JSON dict of database


        set_Database(entry)
            - Use set database values in Local Storage. Verify, merge, append,
                and updates.
            - Public function used anytime needed
            - returns null

        _load_Database()
            - Default database to ensure required content always exists
            - Private function ran by program
            - returns null
*/


function get_Database(){
    // Use to to get the current database in JSON format. Always returns dict.

    
    // Get Database from local storage, build into JSON dict
    let database_Current = JSON.parse(localStorage.getItem(database_Name));
    console.log("function get_Database(): database_Current: ",database_Current);
    // If database exists
    if (database_Current != null) {
        
        // if userdata key doesn't exist, create it
        if (database_Current.userdata == null) {
            database_Current['userdata'] = {};
        };
        
        // if settings key doesn't exist, create it
        if (database_Current.settings == null) {
            database_Current['settings'] = {};
        };
    };
    
    // Return JSON dict
    return database_Current;
};


function set_Database(entry) {
    /* Use to set database values in Local Storage. Verify, merge, append, and
        updates. 
    */
   
    
    //--------------------------------
    //-- LOCAL VAR --> START

    // Used to merge existing and new database changes, then written to Local Storage
    let database_New = {userdata: {},settings:{}, api:{} };
    
    // Used to hold current database values if they exist
    let userdata_Current = {};
    let settings_Current = {};
    
    //-- LOCAL VAR --> END
    //--------------------------------
    // DATABASE VERIFICATION --> START
    
    // Getting local storage database to add to new OBJ to re-write to storage once verified
    let database_Current = get_Database(); 

    // If a Database in Local Storage already exists, verify & collect keys + content
        //-- NOTE: If not true, it's a new database.
    if (database_Current != null) {
        
        // If user already defined in local storage, grab it.
        if (database_Current.userdata != null) {
            userdata_Current = database_Current.userdata;
        }
        
        // If settings already defined in local storage, grab it.
        if (database_Current.settings != null) {
            settings_Current = database_Current.settings;
        }
    }
    

    // DATABASE VERIFICATION -> END // 
    //--------------------------------//
    //-- VALIDATE ENTRY -> START //

    //-- If user data to update database or if _Load_Database() ran.
    if(entry != undefined){
        
        //-- If trying to udpate userdata
        if("userdata" in entry){
            
            // console.log("userdata key exists in entry: ", userdata); //TODO:: 12/07/2021 #EP || Remove console.log when done testing

            // Build userdata results
            for (key in entry.userdata){
                // console.log("entry.userdata_Current[key]: ", key) //TODO:: 12/07/2021 #EP || Remove console.log when done testing
                
                // If the key is already in the database
                if(userdata_Current[key] != undefined){
                    // set Last Login time to now
                    userdata_Current[key].login_Last = time_12();
                }
                
                // IF date isn't in database, add it.
                else {
                    console.log("Key",key, "not yet enetered by EU. Added to database.")
                    //No there yet so adding it
                    userdata_Current[key] = entry.userdata_Current[key];
                }
            };
            
            //Itterate through dates in entries, update database accordingly.
            for(date in entry.userdata_Current){
                
                for (time in entry.userdata_Current[date]){
                    console.log(entry.userdata_Current[date][time]);
                    userdata_Current[date][time] = entry.userdata_Current[date][time];
                }
            }
            
            // Merge userdata_Current logs together from curent and entry
            // userdata_Current = Object.assign({},userdata_Current, entry.userdata_Current);
            // console.log("userdata_Current: ",userdata_Current)
        };

        //-- If setting edit is saved --//
        if ("settings_Current" in entry){
            console.log("settings_Current key exist in entry: ", settings_Current);
            
            // Merge settings_Current together from curent and entry
            settings_Current = Object.assign({},settings_Current, entry.settings_Current);            
        } 
    };    
    //-- VALIDATE ENTRY -> END //
    //--------------------------------//
    // userdata_Current BUILD -> START //
    /* itterate and rebuild userdata_Current */ 

    // get ALL keys within userdata_Current
    let keys = Object.keys(userdata_Current);
    // add them to new OBJ used to update Local Storage
    keys.forEach((key) => {
        // Add key to dictionary
        database_New.userdata_Current[key] = (userdata_Current[key]);
    });
    // userdata_Current BUILD - END //
    //--------------------------------//
    /* settings_Current BUILD -> START */
    /* itterate and rebuild userdata_Current */ 

    // get ALL keys within settings_Current
    keys = Object.keys(settings_Current);
    // add them to new OBJ used to update Local Storage
    keys.forEach((key) => {
        // Add key to dictionary
        database_New.settings_Current[key] = settings_Current[key];
    });
    /* settings_Current BUILD -> END */

    //--  END OF BUILDING DICTIONARY  
    
     console.log("function set_Database(entry): database_New ", database_New);

    // Updating Database
    localStorage.setItem(database_Name, JSON.stringify(database_New));
    return null;
};
//-- END of set_Database(entry)




function _load_Database() {
    //-- Default database to ensure required content always exists
    
    let database_Default = {
        userdata: {
            
            //-- running log of dates user logged in
            timeline: {
                
                //build todays date into database
                [(moment().format("YYYYMMDD"))]: {
                    login_First: time_24(),
                    login_Last: time_24(),
                }
            },
            //-- users saved list. Stores full payload
            saved: {}
        },
        settings: {
           defaults: {
               timeZone: null, // TODO:: 12/08/2021 #EP || Set a Default Time Zone based on browser
           },
           // If user defines these settings_Current, will over-ride defaults
           user: {
             timeZone: null,  
           },
        }
    };

    console.log("function _load_Database() database_Default: ",database_Default) //TODO:: 12/08/2021 #EP || Delete console.log once done testing

    // localStorage.setItem("a_userdata_CurrentScheduler",JSON.stringify(a_userdata_CurrentScheduler));
    
    // Set Default Database 
    set_Database(_load_Database);
    
    return null;
};

//-- DATABASE MANAGEMENT --> END
/* -------------------------------------------------------------------------- */
//-- RUNNING --> START

/* 1. Load the database */
_load_Database();

/* 2. Update Page Setings */

/* 3. Load APIs */

/* 4. Build Page */



//-- RUNNING --> END
/*----------------------------------------------------------------------------*/
