const supabase = createClient(
   'https://ykleeiyhqivgutfkhyoi.supabase.co',
   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlrbGVlaXlocWl2Z3V0ZmtoeW9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzQxOTU3MjcsImV4cCI6MTk4OTc3MTcyN30.5P_T7dzuiVwAxCaNvD9llz5g9_Xp3AU9iJsJi-kNzH8'
 )
  
// auth 

 // Handle form submission
 document.getElementById('magicLinkForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const email = formData.get('email');

  // Check if the email domain is whitelisted
  if (email.endsWith('@ffg.at') || email.endsWith('@gmail.com')) {
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });

      if (error) {
        throw new Error(error.message);
      }

      alert('A magic link has been sent to your email. Click the link to sign in.');
    } catch (error) {
      console.error('Magic link login failed:', error.message);
      alert('Magic link login failed :-/');
    }
  } else {
    alert('Sorry, only email addresses from @ffg.at are allowed.');
  }
});

 // Get user's information and populate the username div
 const getUserInfo = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const magicLinkFormModal = document.getElementById('login');
      const usernameDiv = document.getElementById('username');
      magicLinkFormModal.style.display = 'none';
      usernameDiv.style.display = 'block';
      usernameDiv.innerHTML = `
        <p>Email: ${user.email}</p>
        <p>UUID: ${user.id}</p>
        <p>You are logged in.</p>
      `;

       // Store the user's ID in the global variable
       userId = user.id;

    }
  } catch (error) {
    console.error('Error getting user information:', error.message);
  }
};

// Call the function to get user info
getUserInfo();

// Logout user
document.getElementById('logoutButton').addEventListener('click', async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }

    // Redirect to the base URL after logout
    window.location.href = '#';
    window.location.reload();

    // Clear the user information from the username div
    const usernameDiv = document.getElementById('username');
    usernameDiv.innerHTML = '';

    alert('Logged out successfully.');
  } catch (error) {
    console.error('Logout failed:', error.message);
  }
});

   //get drops start 

async function getDrops() {
  let { data, error } = await supabase
  .from('drops')
  .select('*')
  .order('pub_date_time_start', { ascending: false })
  return data
}

var r = 55;
var g = 155;
var b = 255;


window.onload = checkHash;
window.onhashchange = checkHash;

function checkHash() {

 //get location hash start
 let hashValue = window.location.hash; // get the hash value from the URL
 hashValue = hashValue.substring(1); // remove the "#" character from the hash value

 let listElementDrop = document.getElementById('drop_ul');
 let listElementEpic = document.getElementById('epic_ul');
 let listElementEpicDetail = document.getElementById('epic_detail');
 let listElementManageEpics = document.getElementById('epics_ul');
 let listElementEpicDrops = document.getElementById('epic_drops_ul');
 let listElementDropForm = document.getElementById('dropForm');
 let listElementEpicForm = document.getElementById('epicForm');
 let listElementChannelForm = document.getElementById('channelForm');
 let listElementManageChannels = document.getElementById('channels_ul');
 let listElementDuplicateButton = document.getElementById('duplicateDrop');
 let listElementSubmitButton = document.getElementById('submitDrop');
 let listElementUpdateButton = document.getElementById('updateDrop');
 let listElementUpdateChannelButton = document.getElementById('channelUpdateButton');
 let listElementSubmitChannelButton = document.getElementById('channelSubmitButton');
 let listElementUpdateEpicButton = document.getElementById('epicUpdateButton');
 let listElementSubmitEpicButton = document.getElementById('epicSubmitButton');

 if (hashValue === '') {
  listElementDrop.style.display = "none";
  listElementEpicDetail.style.display = "none";
  listElementManageEpics.style.display = "none";
  listElementEpicDrops.style.display = "none";
  listElementDropForm.style.display = "none";
  listElementEpicForm.style.display = "none";
  listElementChannelForm.style.display = "none";
  listElementManageChannels.style.display = "none";
 }

 if (hashValue.startsWith('topic')) {
  getEpics().then((data) => {

     // Find item by ID
     let itemId = hashValue.substring('topic'.length); // Replace with your desired item ID
     let item = data.find((epic) => epic.id === Number(itemId));
 
     // If the item is found, display its details
     if (item) {
      listElementEpicDetail.style.display = "block";
      listElementEpic.style.display = "block";
      listElementEpic.innerHTML = '<li id="topic' + item.id + '"><div class="contentcontainer"><h1>' + item.title + '</h1><div class="descr">Topic Owner:</div>' + item.owner + '</div></li>'

      getDrops().then((data) => {
        // get Drops with item.channel === itemId here
        listElementEpicDrops.innerHTML = null;
        let items = data.filter((item) => item.epic === itemId);
          
        // Do something with the filtered drops
        items.forEach((item) => {

          const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
          };
         
          let date = new Date(item.pub_date_time_start);
          let locale_pub_date_time_start = date.toLocaleDateString('en-GB', options);

          let channeltitle = '';
  
          let getChannelsPromise = new Promise((resolve, reject) => {
            getChannel().then((data) => {
              data.forEach(item => { 
                channeltitle = item.title;
              });
              resolve();
            });
          });

          async function getChannel() {
            let { data, error } = await supabase
            .from('channels')
            .select('*')
            .eq('id', item.channel)
            return data
          }

          getChannelsPromise.then(() => {
          listElementEpicDrops.style.display = "block";
          listElementEpicDrops.innerHTML += '<tr id="content' + item.id + '"><td id="contentTitle"><a href="#content' + item.id + '">' + item.title + '</a></td><td id="contentChannelTitle">' + channeltitle + '</td><td id="contentDateTime">' + locale_pub_date_time_start + item.timezone + '</td></tr>';
          });

        });

       });

     }

  })
}

  if (hashValue === 'dropForm') {
    listElementDrop.style.display = "none";
    listElementEpicDetail.style.display = "none";
    listElementManageEpics.style.display = "none";
    listElementEpicDrops.style.display = "none";
    listElementDropForm.style.display = "block";
    listElementEpicForm.style.display = "none";
    listElementChannelForm.style.display = "none";
    listElementDuplicateButton.style.display = 'none';
    listElementUpdateButton.style.display = 'none';
    listElementSubmitButton.style.display = 'block';
  }

  if (hashValue === 'epicForm') {
    listElementDrop.style.display = "none";
    listElementEpicDetail.style.display = "none";
    listElementManageEpics.style.display = "contents";
    listElementEpicDrops.style.display = "none";
    listElementDropForm.style.display = "none";
    listElementEpicForm.style.display = "block";
    listElementChannelForm.style.display = "none";
    listElementUpdateEpicButton.style.display = 'none';
    listElementSubmitEpicButton.style.display = "block";
    // epicform Elements here
  }

  if (hashValue === 'channelForm') {
    listElementDrop.style.display = "none";
    listElementEpicDetail.style.display = "none";
    listElementManageEpics.style.display = "none";
    listElementEpicDrops.style.display = "none";
    listElementDropForm.style.display = "none";
    listElementEpicForm.style.display = "none";
    listElementChannelForm.style.display = "block";
    listElementManageChannels.style.display = "contents";
    listElementUpdateChannelButton.style.display = "none";
    listElementSubmitChannelButton.style.display = "block";
    // epicform Elements here
  }

 if (hashValue.startsWith('content')) {
  getDrops().then((data) => { 
    // Find item by ID
    let itemId = hashValue.substring('content'.length); // Replace with your desired item ID
    let item = data.find((drop) => drop.id === Number(itemId));

    // If the item is found, display its details
    if (item) {
      listElementDrop.style.display = "block";
      listElementEpicDetail.style.display = "none";

      async function getEpics() {
        let { data, error } = await supabase
        .from('epics')
        .select('*')
        .eq('id', item.epic)
        return data
      }
     
      let epictitle = '';
      let epicowner = '';

      let getEpicsPromise = new Promise((resolve, reject) => {
        getEpics().then((data) => {
          data.forEach(item => { 
            epictitle = item.title;
            epicowner = item.owner;
          });
          resolve();
     
        });
      });
      
        async function getChannel() {
          let { data, error } = await supabase
          .from('channels')
          .select('*')
          .eq('id', item.channel)
          return data
        }
        
        let channeltitle = '';
        let channelowner = '';
  
        let getChannelsPromise = new Promise((resolve, reject) => {
          getChannel().then((data) => {
            data.forEach(item => { 
              channeltitle = item.title;
              channelowner = item.owner;
            });
            resolve();
          });
        });

        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        };
        
        let date_start = new Date(item.pub_date_time_start);
        let locale_pub_date_time_start = date_start.toLocaleDateString('en-GB', options);
        let date_end = new Date(item.pub_date_time_end);
        let locale_pub_date_time_end = date_end.toLocaleDateString('en-GB', options);
        let imageUrlPath = item.image_url ? JSON.parse(item.image_url).path : '';
        let imageUrlPrefix = 'https://ykleeiyhqivgutfkhyoi.supabase.co/storage/v1/object/public/images';
        let imageUrl = imageUrlPath ? imageUrlPrefix + '/' + imageUrlPath : '';
        
        if (item.assets == '') {
          item.assets = '-';
        }
        
      getEpicsPromise.then(() => {
        getChannelsPromise.then(() => {
         listElementDrop.innerHTML = '<li id="content' + item.id + '" class="modal"><div class="close"><a href="#"><i class="gg-close"></i></a></div><div class="contentcontainer">' + locale_pub_date_time_start + '&nbsp;-&nbsp;' + locale_pub_date_time_end + '&nbsp;(' + item.timezone + ')</div><h1>' + item.title + '</h1>' + '<div class="copy">' + item.text + '</div><div class="descr"><img src="' + imageUrl + '" /></div><div class="descr">Channel:</div>' + channeltitle + '</div><div class="descr">Images, Videos, Assets:</div>' + item.assets + '<div class="descr">Topic:</div><a href="#topic' + item.epic + '">' + epictitle + '</a><div class="descr">Channel Owner:</div>' + channelowner + '<div class="descr">Topic Owner:</div>' + epicowner + '<div class="editcontainer"><a href="#editcontent' + item.id + '" class="button">Edit</a>&nbsp;<a href="#duplicatecontent' + item.id + '" class="button">Duplicate</a>&nbsp;<input type="button" name="delete" id="deleteDrop" value="Delete" onclick="DeleteDrop()" class="cta"/></div></div></li>';
        });
      });

    }

  })
 }

 if (hashValue.startsWith('editcontent')) {
  getDrops().then((data) => { 
  
    // Find item by ID
    let itemId = hashValue.substring('editcontent'.length); // Replace with your desired item ID
    let item = data.find((drop) => drop.id === Number(itemId));
    let listElementTitle = document.getElementById('title'); 
    // let listElementText = document.getElementById('text'); 
    let listElementAssets = document.getElementById('assets'); 
    let listElementPub_Date_Time_Start = document.getElementById('pub_date_time_start');
    let listElementPub_Date_Time_End = document.getElementById('pub_date_time_end');
    let listElementEpicid = document.getElementById("epic");
    let listElementChannelid = document.getElementById("channel");

    if (item) {
      listElementDrop.style.display = 'none';
      listElementDropForm.style.display = 'block';
      listElementDuplicateButton.style.display = 'none';
      listElementUpdateButton.style.display = 'block';
      listElementSubmitButton.style.display = 'none';

      listElementTitle.value = item.title;
      quill.root.innerHTML = item.text;
      listElementAssets.value = item.assets;

      
      let date_start = new Date(item.pub_date_time_start);
      let timezoneOffset = date_start.getTimezoneOffset();
      date_start.setMinutes(date_start.getMinutes() - timezoneOffset);
      let defaultDate_start = date_start.toISOString().slice(0, 16);
      listElementPub_Date_Time_Start.value = defaultDate_start;      
    
      let date_end = new Date(item.pub_date_time_end);
      date_end.setMinutes(date_end.getMinutes() - timezoneOffset);
      let defaultDate_end = date_end.toISOString().slice(0, 16);
      listElementPub_Date_Time_End.value = defaultDate_end; 

      listElementEpicid.value = item.epic;
      listElementChannelid.value = item.channel;
    }

  })

}

if (hashValue.startsWith('duplicatecontent')) {
  getDrops().then((data) => { 
  
    // Find item by ID
    let itemId = hashValue.substring('duplicatecontent'.length); // Replace with your desired item ID
    let item = data.find((drop) => drop.id === Number(itemId));
    let listElementTitle = document.getElementById('title'); 
    let listElementText = document.getElementById('text'); 
    let listElementAssets = document.getElementById('assets'); 
    let listElementPub_Date_Time_Start = document.getElementById('pub_date_time_start');
    let listElementPub_Date_Time_End = document.getElementById('pub_date_time_end');
    let listElementEpicid = document.getElementById("epic");
    let listElementChannelid = document.getElementById("channel");

    if (item) {

      listElementDrop.style.display = 'none';
      listElementDropForm.style.display = 'block';
      listElementDuplicateButton.style.display = 'block';
      listElementUpdateButton.style.display = 'none';
      listElementSubmitButton.style.display = 'none';

      listElementTitle.value = item.title;
      listElementText.value = item.text;
      listElementAssets.value = item.assets;

        let date_start = new Date(item.pub_date_time_start);
        let timezoneOffset = date_start.getTimezoneOffset();
        date_start.setMinutes(date_start.getMinutes() - timezoneOffset);
        let defaultDate_start = date_start.toISOString().slice(0, 16);
        listElementPub_Date_Time_Start.value = defaultDate_start;      
      
        let date_end = new Date(item.pub_date_time_end);
        date_end.setMinutes(date_end.getMinutes() - timezoneOffset);
        let defaultDate_end = date_end.toISOString().slice(0, 16);
        listElementPub_Date_Time_End.value = defaultDate_end; 
      
      listElementEpicid.value = item.epic;
      listElementChannelid.value = item.channel;
    }

  })

}

//hashlocation and get channels start
if (hashValue.startsWith('editchannel')) {
  getChannels().then((data) => { 
  
    // Find item by ID
    let itemId = hashValue.substring('editchannel'.length); // Replace with your desired item ID
    let item = data.find((channel) => channel.id === Number(itemId));

    let listElementTitle = document.getElementById('channelFormTitle'); 
    let listElementMediatype = document.getElementById('channelFormMediatype');
    let listElementOwner = document.getElementById('channelFormOwner');
    let listElementOrder = document.getElementById('channelFormOrder');

    if (item) {
      listElementDrop.style.display = 'none';
      listElementDropForm.style.display = 'none';
      listElementChannelForm.style.display = "block";
      listElementManageChannels.style.display = 'none';
      listElementDuplicateButton.style.display = 'none';
      listElementSubmitButton.style.display = 'none';
      listElementUpdateButton.style.display = 'none';
      listElementSubmitChannelButton.style.display = 'none';
      listElementUpdateChannelButton.style.display = 'block';
      listElementTitle.style.display = 'block';
      listElementMediatype.style.display = 'block';
      listElementOwner.style.display = 'block';
      listElementOrder.style.display = 'block';

      listElementTitle.value = item.title;
      listElementMediatype.value = item.mediatype;
      listElementOwner.value = item.owner;
      listElementOrder.value = item.order;
    }

  })

}

//hashlocation and get epics start
if (hashValue.startsWith('editepic')) {
  getEpics().then((data) => { 
  
    // Find item by ID
    let itemId = hashValue.substring('editepic'.length); // Replace with your desired item ID
    let item = data.find((epic) => epic.id === Number(itemId));

    let listElementTitle = document.getElementById('epicFormTitle'); 
    let listElementOwner = document.getElementById('epicFormOwner');

    if (item) {
      listElementDrop.style.display = 'none';
      listElementDropForm.style.display = 'none';
      listElementChannelForm.style.display = "none";
      listElementManageChannels.style.display = 'none';
      listElementDuplicateButton.style.display = 'none';
      listElementSubmitButton.style.display = 'none';
      listElementUpdateButton.style.display = 'none';
      listElementSubmitChannelButton.style.display = 'none';
      listElementUpdateChannelButton.style.display = 'none';
      listElementEpicForm.style.display = 'block';
      listElementManageEpics.style.display = 'none';
      listElementSubmitEpicButton.style.display = 'none';
      listElementUpdateEpicButton.style.display = 'block';
      listElementTitle.style.display = 'block';
      listElementOwner.style.display = 'block';

      listElementTitle.value = item.title;
      listElementOwner.value = item.owner;
    }

  })

}

};
  //hashlocation end
  

  // fullcalendar start 
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
    headerToolbar: {
      left: window.innerWidth < 768 ? 'prev,next' : 'today prev,next',
      center: 'title',
      right: window.innerWidth < 768 ? 'resourceTimelineToday,resourceTimelineMonth' : 'resourceTimelineToday,resourceTimelineSevenDay,resourceTimelineMonth'
    },
    initialView: window.innerWidth < 768 ? 'resourceTimelineToday' : 'resourceTimelineSevenDay',
    firstDay: 1, // Monday
    views: {
      resourceTimelineSevenDay: {
        type: 'resourceTimeline',
        duration: { days: 7 },
        buttonText: 'Week'
      },
      resourceTimelineToday: {
        type: 'resourceTimeline',
        duration: { days: 1 },
        buttonText: 'Day'
      },
      resourceTimelineMonth: {
        buttonText: 'Month'
      }
    },
    resourceAreaWidth: window.innerWidth < 768 ? '40%' : '20%',
    resourceAreaColumns: [
      // {
      //   group: true,
      //   field: 'mediatype',
      //   headerContent: 'Mediatype'
      // },
      {
        field: 'title',
        headerContent: 'Channels'
      }
    ],
    aspectRatio: window.innerWidth < 768 ? 0.66 : 3,
    navLinks: false,
    /*hour12: false,*/
    locale: 'en-GB',

    resourceOrder: 'order',
  
    resources: function getChannelsData(info, successCallback, failureCallback) {
      getChannels().then(data => {

        const channelresources = data.map(item => ({
          id: item.id,
          title: item.title,
          mediatype: item.mediatype,
          order: item.order
        }));

        successCallback(channelresources);
      }).catch(error => {
        failureCallback(error);
      });
    },
  
    // defaultTimedEventDuration: '04:00:00',
    eventSources: [
      {
        events: function(info, successCallback, failureCallback) {
          getDrops().then(data => {
            const events = data.map(item => ({
              title: item.title,
              start: item.pub_date_time_start, // Assuming this is the property representing the start date of the event
              end: item.pub_date_time_end,
              url: '#content' + item.id,
              resourceId: item.channel,
              color: 'rgba(' + item.epic * r + ',' + item.epic * g + ',' + item.epic * b + ',100)', // You can customize the color of the event here
              // allDay: false,
              editable: false,
              startEditable: false,
              resourceEditable: false
            }));
            successCallback(events);
          }).catch(error => {
            failureCallback(error);
          });
        }
        
      }
    ],

    // Add this function to log the current view date range
  viewDidMount: function(view) {
    console.log('Current view date range:', getDateRangeInView(calendar));
  }
  
  });

  // This function remains the same as before
function getDateRangeInView(calendar) {
  var view = calendar.view;
  var start = view.currentStart;
  var end = view.currentEnd;
  var dateRange = {
    start: start,
    end: end
  };
  return dateRange;
}

  calendar.render();

  
  function searchEvents(searchTerm) {
    calendar.getEvents().forEach(function(event) {
      var eventTitle = event.title.toLowerCase();
      if (eventTitle.includes(searchTerm)) {
        event.setProp('display', '');
      } else {
        event.setProp('display', 'none');
      }
    });
  }

    // Add input event listener to perform real-time search
  // document.getElementById('eventSearch').addEventListener('input', function() {
  //   var searchTerm = this.value.toLowerCase();
  //   searchEvents(searchTerm);
  // });

  document.getElementById('searchButton').addEventListener('click', function() {
    var searchTerm = document.getElementById('eventSearch').value.toLowerCase();
    searchEvents(searchTerm);
  });
  
  function searchEvents(searchTerm) {
    calendar.getEvents().forEach(function(event) {
      var eventTitle = event.title.toLowerCase();
      if (eventTitle.includes(searchTerm)) {
        event.setProp('display', '');
      } else {
        event.setProp('display', 'none');
      }
    });
  }
  

  // Add click event listener to the clear button
  document.getElementById('clearSearch').addEventListener('click', function() {
    document.getElementById('eventSearch').value = ''; // Clear the input field

    // Clear the search results by resetting the FullCalendar view
  calendar.getEvents().forEach(function(event) {
    event.setProp('display', ''); // Show all events
  });

  // Re-render the calendar
  calendar.render();
  
  });

  
  // fullcalendar end

  // Inserting start
    //get epics start
    async function getEpics() {
      let { data, error } = await supabase.from('epics').select('*')
      return data
    }
    getEpics().then((data) => {  
      
      let listElement = document.getElementById('epic');
      let listElementManageEpics = document.getElementById('epics_ul');

      data.forEach(item => {

        listElement.innerHTML += '<option value="' + item.id + '">' + item.title + '</div>' + '</option>';
        listElementManageEpics.innerHTML += '<tr id="epic' + item.id + '"><td id="epicTitle">' + item.title + '</td><td id="epicOwner">' + item.owner + '</td><td id="tableAction"><a href="#editepic' + item.id + '" class="buttonxs"/>Edit</a>&nbsp;<input type="linkxs" name="delete" id="deleteEpic" value="Delete" onclick="DeleteEpic(' + item.id + ')" class="cta"/></td></tr>';
        
      });

    })
    //get epics end

    //get channels start
    async function getChannels() {
      let { data, error } = await supabase.from('channels').select('*')
      return data
    }
    getChannels().then((data) => {  

        // Sort the data by the "order" property
        data.sort((a, b) => a.order - b.order);

      let listElement = document.getElementById('channel');
      let listElementManageChannels = document.getElementById('channels_ul');

      data.forEach(item => {
        listElement.innerHTML += '<option value="' + item.id + '">' + item.title + '</div>' + '</option>';
        listElementManageChannels.innerHTML += '<tr id="channel' + item.id + '"><td id="channelTitle">' + item.title + '</td><td id="channelMediatype">' + item.mediatype + '</td><td id="channelOwner">' + item.owner + '</td><td id="channelOwner">' + item.order + '</td><td id="tableAction"><a href="#editchannel' + item.id + '" class="buttonxs"/>Edit</a>&nbsp;<input type="linkxs" name="delete" id="deleteChannel" value="Delete" onclick="DeleteChannel(' + item.id + ')" class="cta"/></td></tr>';
      });

    })
    //get channels end

   // required fields start
   const channelFormTitle = document.getElementById("channelFormTitle");
   const channelFormMediatype = document.getElementById("channelFormMediatype");
   const submitButtonChannel = document.getElementById("submitChannel");

   const epicFormTitle = document.getElementById("epicFormTitle");
   const submitButtonEpic = document.getElementById("submitEpic");

    const titleInput = document.getElementById("title");
    const epicSelect = document.getElementById("epic");
    const channelSelect = document.getElementById("channel");
    const pubDateTimeInput = document.getElementById("pub_date_time_start");
    const submitButtonDrop = document.getElementById("submitDrop");
    const duplicateButtonDrop = document.getElementById('duplicateDrop');
    const updateButtonDrop = document.getElementById('updateDrop');

    // Disable the submit button initially
    submitButtonChannel.disabled = true;
    submitButtonEpic.disabled = true;
    submitButtonDrop.disabled = true;
    duplicateButtonDrop.disabled = true;
    updateButtonDrop.disabled = true;

    // Add an event listener to the required fields to check if they are empty
    channelFormTitle.addEventListener("input", checkRequiredFields);
    channelFormMediatype.addEventListener("input", checkRequiredFields);
    epicFormTitle.addEventListener("input", checkRequiredFields);
    titleInput.addEventListener("input", checkRequiredFields);
    epicSelect.addEventListener("input", checkRequiredFields);
    channelSelect.addEventListener("input", checkRequiredFields);
    pubDateTimeInput.addEventListener("input", checkRequiredFields);

    function checkRequiredFields() {
      // Check if any of the required fields are empty
      const isEmptyChannel = [channelFormTitle, channelFormMediatype].some(field => field.value === "");
      const isEmptyEpic = [epicFormTitle].some(field => field.value === "");
      const isEmptyDrop = [titleInput, epicSelect, channelSelect, pubDateTimeInput].some(field => field.value === "");

      // Disable the submit button if any required field is empty, otherwise enable it
      submitButtonChannel.disabled = isEmptyChannel;
      submitButtonEpic.disabled = isEmptyEpic;
      submitButtonDrop.disabled = isEmptyDrop;
      duplicateButtonDrop.disabled = isEmptyDrop;
      updateButtonDrop.disabled = isEmptyDrop;

    }
    //required fields end

    //insert drops start

    var quill = new Quill('#text', {
      theme: 'snow'
    });

   function SubmitDrop() {  
     
     const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        };                    
        
      var title = document.getElementById('title').value; 
      var text = quill.root.innerHTML;
      var assets = document.getElementById('assets').value; 
      var pub_date_time_start = document.getElementById('pub_date_time_start').value;
      let date_start = new Date(pub_date_time_start);
      var pub_date_time_end = document.getElementById('pub_date_time_end').value;
      let date_end = new Date(pub_date_time_end);
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      var d = new Date(); 
      var timezone_offset = -d.getTimezoneOffset()/60; 
      var epicid = document.getElementById("epic");
      var epic = epicid.value;
      var channelid = document.getElementById("channel");
      var channel = channelid.value;

       // Handle image upload
      const imageInput = document.getElementById('imageUpload');
      const imageFile = imageInput.files[0];

      async function uploadImage(file) {
        const { data, error } = await supabase.storage.from('images').upload(`images/${file.name}`, file, {
          cacheControl: '3600', // Adjust cache control as needed
        });

        if (error) {
          console.error('Error uploading image:', error.message);
          return null;
        }

        return data;
      }

    async function insertNewDrop() {
      // Upload the image and get its URL
      const imageUrl = imageFile ? await uploadImage(imageFile) : null;

      const { data, error } = await supabase
        .from('drops')
        .insert([
          {
            title: title,
            text: text,
            epic: epic,
            channel: channel,
            pub_date_time_start: date_start,
            pub_date_time_end: date_end,
            timezone: timezone,
            timezone_offset: timezone_offset,
            assets: assets,
            uuid: userId,
            image_url: imageUrl, // Store the image URL in the database
          },
        ]);

      return data;
    }

    
      insertNewDrop().then((data) => {
        window.location.replace("#");
        setTimeout(function() { window.location.reload(); }, 5);
      })
  
  }
  //insert drops end

  //insert epics start
  function SubmitEpic() {  

    var title = document.getElementById('epicFormTitle').value; 
    var owner = document.getElementById('epicFormOwner').value;     
    
    async function insertNewEpic() {
    const { data, error } = await supabase
      .from('epics')
      .insert([
        { title: title , owner: owner , uuid: userId }
      ])
  
    return data
  }
  
    insertNewEpic().then((data) => {
      window.location.replace("#epicForm");
      setTimeout(function() { window.location.reload(); }, 5);
    })

}
  //insert epics end

 //insert channels
  function SubmitChannel() {  

    var title = document.getElementById('channelFormTitle').value; 
    var owner = document.getElementById('channelFormOwner').value; 
    var order = document.getElementById('channelFormOrder').value; 
    var mediatype = document.getElementById('channelFormMediatype').value; 
    
    async function insertNewChannel() {
    const { data, error } = await supabase
      .from('channels')
      .insert([
        { title: title , owner: owner , order: order , mediatype: mediatype, uuid: userId }
      ])
  
    return data
  }
  
    insertNewChannel().then((data) => {
      window.location.replace("#channelForm");
      setTimeout(function() { window.location.reload(); }, 5);
    })
}
//insert channels end

//update Drop start
function UpdateDrop() {

    let hashValue = window.location.hash; // get the hash value from the URL
    hashValue = hashValue.substring(1); // remove the "#" character from the hash value
    let itemId = hashValue.substring('editcontent'.length); 
       
    var newtitle = document.getElementById('title').value; 
    var newtext = quill.root.innerHTML;
    var newassets = document.getElementById('assets').value; 
    var newpub_date_time_start = document.getElementById('pub_date_time_start').value;
    let newdate_start = new Date(newpub_date_time_start);
    var newpub_date_time_end = document.getElementById('pub_date_time_end').value;
    let newdate_end = new Date(newpub_date_time_end);
    const newtimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    var newd = new Date(); 
    var newtimezone_offset = -newd.getTimezoneOffset()/60; 
    var newepicid = document.getElementById("epic");
    var newepic = newepicid.value;
    var newchannelid = document.getElementById("channel");
    var newchannel = newchannelid.value;
    var newuuid = userId;

  // Handle image upload BUG HERE
  const imageInput = document.getElementById('imageUpload');
  const imageFile = imageInput.files[0];

  async function uploadImage(file) {
    const { data, error } = await supabase.storage.from('images').upload(`images/${file.name}`, file, {
      cacheControl: '3600', // Adjust cache control as needed
    });

    if (error) {
      console.error('Error uploading image:', error.message);
      return null;
    }

    return data;
  }

   
  async function setDrop() {
    // Upload the image and get its URL BUG HERE
    const newimageUrl = imageFile ? await uploadImage(imageFile) : null;

  let { data, error } = await supabase
      .from('drops')
      .update({ title: newtitle, text: newtext, epic: newepic, channel: newchannel, pub_date_time_start: newdate_start, pub_date_time_end: newdate_end, timezone_offset: newtimezone_offset, assets: newassets, uuid: newuuid, image_url: newimageUrl})
      .match({ id: itemId })
      return data
     }
  
  setDrop().then((data) => {
   window.location.replace("#");
   setTimeout(function() { window.location.reload(); }, 5);
   })
  };
//update Drop end

//delete Drop start
function DeleteDrop() {

  let hashValue = window.location.hash; // get the hash value from the URL
  hashValue = hashValue.substring(1); // remove the "#" character from the hash value
  let itemId = hashValue.substring('content'.length); 

async function setDrop() {
let { data, error } = await supabase
    .from('drops')
    .delete()
    .match({ id: itemId })
    return data
   }

setDrop().then((data) => {
 window.location.replace("#");
 setTimeout(function() { window.location.reload(); }, 5);
 })
};
//delete Drop end

//delete Channel start
function DeleteChannel(id) {
  async function setChannel() {
    let { data, error } = await supabase
      .from('channels')
      .delete()
      .match({ id: id })
    return data
  }

  setChannel().then((data) => {
    window.location.replace("#channelForm");
    setTimeout(function() { window.location.reload(); }, 5);
  })
};
//delete Channel end

//update Channel start
function UpdateChannel() {

  let hashValue = window.location.hash; // get the hash value from the URL
  hashValue = hashValue.substring(1); // remove the "#" character from the hash value
  let itemId = hashValue.substring('editchannel'.length); 

var newtitle = document.getElementById('channelFormTitle').value; 
var newmediatype = document.getElementById("channelFormMediatype").value;
var newowner = document.getElementById("channelFormOwner").value;
var neworder = document.getElementById("channelFormOrder").value;
var newuuid = userId;
 
async function setChannel() {
let { data, error } = await supabase
    .from('channels')
    .update({ title: newtitle, mediatype: newmediatype, owner: newowner, order: neworder, uuid: newuuid})
    .match({ id: itemId })
    return data
   }

setChannel().then((data) => {
 window.location.replace("#channelForm");
 setTimeout(function() { window.location.reload(); }, 5);
 })
};
//update Channel end

//delete Epic start
function DeleteEpic(id) {
  async function setEpic() {
    let { data, error } = await supabase
      .from('epics')
      .delete()
      .match({ id: id })
    return data
  }

  setEpic().then((data) => {
    window.location.replace("#epicForm");
    setTimeout(function() { window.location.reload(); }, 5);
  })
};
//delete Epic end

//update Epic start
function UpdateEpic() {

  let hashValue = window.location.hash; // get the hash value from the URL
  hashValue = hashValue.substring(1); // remove the "#" character from the hash value
  let itemId = hashValue.substring('editepic'.length); 

  var newtitle = document.getElementById('epicFormTitle').value; 
  var newowner = document.getElementById("epicFormOwner").value;
  var newuuid = userId;
  
  async function setEpic() {
  let { data, error } = await supabase
      .from('epics')
      .update({ title: newtitle, owner: newowner, uuid: newuuid})
      .match({ id: itemId })
      return data
    }

  setEpic().then((data) => {
  window.location.replace("#epicForm");
  setTimeout(function() { window.location.reload(); }, 5);
  })
  };
//update Epic end

// get relativeCoundDay

async function getRelativeCountDay() {
  let { data, error } = await supabase.from('relativeCountDay').select('*')
  return data
}
getRelativeCountDay().then((data) => {  
  
  // let listElement = document.getElementById('epic');
  // let listElementManageEpics = document.getElementById('epics_ul');

  data.forEach(item => {

    // listElement.innerHTML += '<option value="' + item.id + '">' + item.title + '</div>' + '</option>';
    // listElementManageEpics.innerHTML += '<tr id="epic' + item.id + '"><td id="epicTitle">' + item.title + '</td><td id="epicOwner">' + item.owner + '</td><td id="tableAction"><a href="#editepic' + item.id + '" class="buttonxs"/>Edit</a>&nbsp;<input type="linkxs" name="delete" id="deleteEpic" value="Delete" onclick="DeleteEpic(' + item.id + ')" class="cta"/></td></tr>';
    
  });

})