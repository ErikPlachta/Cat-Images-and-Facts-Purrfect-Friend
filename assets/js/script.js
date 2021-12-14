//--    Custom JS for Purrfect Friend
//--    Author(s): Erik Plachta, Connie Barrantes
//--    Date_Created: 12/07/2021 

/* -------------------------------------------------------------------------- */
//-- START --> GLOBALS 

// For local storage DB
const database_Name = "purrfect-friend";

//-- Used when building container holding image and cat-fact. Unique to each IMG span
    //TODO:: 12/13/2021 #EP || Pass this via function instead of global variable
var current_ID = '';

//-----------------------------
//-- TIME RELATED VARIABLES

// Total Hours in Day
const hours_Day = 24;

// Moment JS date
const today = function() {return moment().format("dddd, MMMM Do YYYY")};

// hour in 24 hour format - hour (24) | minute | second | miliseconds | am-pm
const time_24 = function() { return moment().format("HH:mm:ss:ms a")};

// hour in 12 hour format - hour (12) | minute | second | miliseconds | am-pm
const time_12 = function() { return moment().format("hh:mm:ss:ms a")};

//date & time for database logging down to the milisecond
const datetime_12 = function() { return moment().format("YYYYMMDD hh:mm:ss:ms a")};

//-- universal sleep function
    //TODO:: 12/13/2021 #EP || Delete or use.
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
sleep(100);

//-- END --> GLOBALS 
/*----------------------------------------------------------------------------*/
//-- START -> FETCH & BUILD CONTENT

//-- Called by RUN to run API calls.
function _build_catCard(){
    //-- This API runs first and then calls cat fact
        //TODO: 12/13/2021 #EP || Add async on this and run function call by itself
    _get_TheCatAPI();
}

//-- Gets URL from TheCatAPI
const _get_TheCatAPI = async () => {

    //-- Fetch Request for images
        //-- creating variable so async event can run. 
    const response = (async () => {
        
        const res = await fetch("https://api.thecatapi.com/v1/images/search");
        const json = await res.json();
        //TODO::12/12/2021 #EPCB || Add if/else catch. If fails to fetch
        _build_Content(json);
    })();
    return null;
}

//-- Gets Cat Fact from catfact.ninja
const _set_CatFactsApi = async () => {

    const response = (async () => {
        
        const res = await fetch("https://catfact.ninja/fact");
        const json = await res.json();
        //TODO::12/12/2021 #EPCB || Add if/else catch. If fails to fetch
        $("#"+current_ID).text(json.fact);
    })();
    
    
    return null;
}

function _build_Content(response){
    /* Takes Fetch Results from JSON and builds website content dynamically */

    // get catCards container to append child below
    let catCards_Section = document.getElementById("catCards");

    //-- for each image received
    for (key in response){
        
        //-- get the results in variable
        var results = response[key];
        
        // Create DIV to hold animal card
        var div = document.createElement("div");
        
        // set the div class as animal for css
        div.setAttribute("class","catCard");

        // Make animals ID the div element ID
        div.setAttribute("id", results.id);

        //-- Creating HTML content to dynamically build onto page
        div.innerHTML = 
            // '<h3 class="animal_Name">ID: '+results.id+'</h3>' //TODO: 12/13/2021 #EPCB || Add names
            '<img class="catImage" alt="Random Cat Image from TheCatAPI" src="' + results.url + '">'
            +'<span id="catFact_'+results.id+'"></span>'

        //-- Add div built to page
        catCards_Section.appendChild(div);
        
        //-- Update global variable, current_ID, so cat-fact can connect to img
        current_ID = "catFact_" +results.id;
        
    }

    //-- Set the cat fact to the related div container in span placeholder
    _set_CatFactsApi()

    //TODO:: 12/13/2021 #EP || Remove once done testing
    console.log("//-- END --> function _build_Content(response)")
    
    //-- nothing to return 
    return null;
}

//-- END -> BUILD CONTENT
/*----------------------------------------------------------------------------*/
/*-- DATABASE MANAGEMENT --> START

    - Manages all database related functionality with three functions. 
    - Runs all three on APP start-up.

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

//-- Gets Database from local Storage
function get_Database(){
    // Use to to get the current database in JSON format. Always returns dict.

    // Get Database from local storage, build into JSON dict
    let database_Current = JSON.parse(localStorage.getItem(database_Name));

    //TODO:: 12/12/2021 #EP || DELETE Once done testing
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

        if (database_Current.api == null) {
            database_Current['api'] = {};
        };
    };
    
    //-- Returns JSON dict
    return database_Current;
};
//-- END -> get_Database()

//-- Builds database in Local storage
function set_Database(entry) {
    /* Use to set database values in Local Storage. Verify, merge, append, and
        updates. 
    */
    
    //--------------------------------
    //-- LOCAL VAR --> START
    
    /* What WILL be saved as new
        Used to merge existing and new database changes,
        then written to Local Storage
    */
    let database_New = {userdata:{}, settings:{}, api:{} };


    /* What's in the database right now  
             Getting local storage database to add to new OBJ to
             re-write to storage once verified 
    */
    let database_Current = get_Database();

    
    // Used to hold current database values if they exist
    let userdata_Current = {};
    let settings_Current = {};
    let api_Current = {};
    
    //-- LOCAL VAR --> END
    //--------------------------------
    // DATABASE INTEGRITY --> START  

    // If a Database in Local Storage already exists, verify & collect keys + content
        //-- NOTE: If not true, it's a new database.
    if (database_Current != null) {
        
        // If user already defined in local storage, grab it.
        if (database_Current.userdata != null) {
            
            // Merge current database.userdata to new placeholder
            userdata_Current = database_Current.userdata;
            
            // update last login time
            userdata_Current.login_Last = datetime_12();
        }
        
        // If settings already defined in local storage, grab it.
        if (database_Current.settings != null) {
            settings_Current = database_Current.settings;
        }

         // If API already defined in local storage, grab it.
         if (database_Current.api != null) {
            api_Current = database_Current.api;
        }
    }
    
    // Database not yet built so set some default values
    else {
            
        // First login for the user, so update value.
        userdata_Current['login_First'] = datetime_12();   
    }

    // DATABASE INTEGRITY -> END // 
    //--------------------------------//
    //-- ENTRY INTEGRITY -> START //


    //-- TODO:: 12/08/2021 #EP || If the entry fits required params or not. ( a later thing )

    //-- If user action to update database or if _Load_Database() ran.
    if(entry != undefined){
        
        //-- If entry provides userdata values
        if(entry.userdata != null){
            
            // Build userdata results
            for (key in entry.userdata){
                
                // IF userdata key not yet defined in database, add it.
                if(userdata_Current[key] == undefined){                
                    userdata_Current[key] = entry.userdata[key];
                }
            };
            
            /* FOR EACH DATE IN TIMELINE

                Iterate through userdata.timeline dates, update the database.
                Used when page runs, so if new date on load new timeline entry
            */
            for(date in entry.userdata.timeline){
                //add entry value to what will be written to local storage
                userdata_Current.timeline[date] = entry.userdata.timeline[date];
                
                // if first login for the day
                if(userdata_Current.timeline[date].login_First == null){
                    // Set current date and time
                    userdata_Current.timeline[date].login_First = datetime_12();
                }
            }
        };

        //-- If entry provides setting values
        if (entry.settings != null){
            // Merge settings_Current together from current and entry
            settings_Current = Object.assign({},settings_Current, entry.settings);            
        } 

        //--If entry provides api values
        if (entry.api != null){        
            // TODO:: 12/08/2021 #EP || Confirm if this is working once api data in
            
            // Merge settings_Current together from current and entry
            api_Current = Object.assign({},api_Current, entry.api);
        } 
    }; 

    //-- END --> ENTRY INTEGRITY
    //--------------------------------//
    /* START -> MERGING DATA
        
        itterates current database and adds 
    */ 
    
    // Grab current userdata Keys and merge
    Object.keys(userdata_Current).forEach((key) => {
        // Add keys to dictionary
        database_New.userdata[key] = (userdata_Current[key]);
    });
    
    // Grab curent setting keys and merge
    Object.keys(settings_Current).forEach((key) => {
        // Add key to dictionary
        database_New.settings[key] = settings_Current[key];
    });
    // Grab curent API values and merge
    Object.keys(api_Current).forEach((key) => {
        // Add key to dictionary
        database_New.api[key] = api_Current[key];
    });
    

    //-- END -> BUILDING DICTIONARY  
    
    //TODO:: 12/12/2021 #EP || Delete once done testing.
    console.log("function set_Database(entry): database_New ", database_New);

    // Updating Database
    localStorage.setItem(database_Name, JSON.stringify(database_New));

    return null;
};
//-- END -> set_Database(entry)

//-- Verifies Default Database exists
function _load_Database() {
    //-- Default database to ensure required content always exists

    let database_Default = {
        
        //-- USER SESSION DATA
        userdata: {
            
            //-- running log of dates user logged in
            timeline: {
                
                //build todays date into database
                [(moment().format("YYYYMMDD"))]: {
                    //-- first login of the day
                    login_First: null,
                    //-- last login of the day
                    login_Last: datetime_12(),
                     //-- record of search parameters
                    search_Requests: {},
                    //-- record of what was clicked on
                    view_History: {}
                },
            },
            //-- users saved list. Stores full payload
            saved: {},

            //-- first login ever
            //TODO: 12/12/2021 #EP || Fix this, it's overwriting every refresh
            login_First: null, //TODO:: 12/08/2021 #EP || Make only update once
            //-- last login ever.
            login_Last: datetime_12(),
        },
        
        //-- APP SETTINGS
        settings: {
           defaults: {
               timeZone: null, // TODO:: 12/08/2021 #EP || Set a Default Time Zone based on browser
               //-- The number of images to load at once
               images: 6 
           },
           // If user defines these settings_Current, will over-ride defaults
           user: {
             timeZone: null,
             zipCode: null,
             city: null
           },
        },
        
        //-- API SETTINGS
        api: {
            catfactninja: {
                docs: "https://catfact.ninja/docs/api-docs.json",
            },
            thecatapi: {
                docs: "https://docs.thecatapi.com/"
            }
        }
    };
    //-- end of database_Default

    //TODO:: 12/08/2021 #EP || Delete console.log once done testing
    console.log("function _load_Database() database_Default: ",database_Default) 
    
    //-- Set Default Database 
    set_Database(database_Default);
    
    return null;
};

//-- DATABASE MANAGEMENT --> END
/*----------------------------------------------------------------------------*/
//-- RUNNING --> START


function run_Program(){

    /* 1. Load the database */
    _load_Database();

    /* 2. Update Page Setings */

    // Navigation
    // Footer
    // ETC


    /* 3. Build Page Dynamically */
    let database = get_Database()

    for(images = 0; images < database.settings.defaults.images; images++ ) {
        _build_catCard();
    }
    
    /*4. Add event listners*/
    add_Animations();
}

//-- Executes App
run_Program();


//-- Animate cards appearing on load
function add_Animations(){
        
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
          document.getElementById('catCards').classList.add('slideRight');
        }, 1000);
    }, false);
}




//-- RUNNING --> END
/*----------------------------------------------------------------------------*/
//-- START --> TESTING

const _get_LocalTestData_JSON = async () => {
    //-- Used to pull local JSON file to page for testing

    const response = (async () => {
        
        const res = await fetch("./assets/json/test_Cats.json");
        const json = await res.json();
        console.log(json);
        _build_Content(json);
        //TODO::12/12/2021 #EPCB || Add if/else catch. If fails to fetch
    })();
    // _build_Content(response);
    
    return null;
}
// _get_LocalTestData_JSON();

//-- END --> TESTING
/*----------------------------------------------------------------------------*/