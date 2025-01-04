// // Function to create a timeline item HTML string
// function createTimelineItem(event, isActive) {
//     return `
//       <div class="relative flex items-start">
//         <!-- Timeline dot -->
//         <div class="absolute -left-[1.35rem] mt-1.5">
//           <div class="h-4 w-4 rounded-full border-2 ${
//             isActive ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'
//           }"></div>
//         </div>
        
//         <!-- Content -->
//         <div class="ml-6">
//           <p class="font-semibold text-gray-800">${event.currentStatus}</p>
//           <p class="text-sm text-gray-600">${event.location}</p>
//           <p class="text-sm text-gray-500">${new Date(event.timestamp).toLocaleString()}</p>
//         </div>
//       </div>
//     `;
//   }
  
//   // Function to show error message
//   function showError(message) {
//     const timeline = document.getElementById('timeline');
//     timeline.innerHTML = `
//       <div class="text-red-500 p-4">
//         ${message}
//       </div>
//     `;
//   }
  
//   // Main function to load tracking details
//   async function loadTrackingDetails(orderId) {
//     try {
//       const response = await fetch(`http://localhost:8081/order/track/order/${orderId}`);
//       if (!response.ok) throw new Error('Failed to fetch tracking details');
//       const data = await response.json();
  
//       // Update basic information
//       document.getElementById('displayOrderId').textContent = data.orderId;
//       document.getElementById('carrier').textContent = data.carrier;
//       document.getElementById('trackingNumber').textContent = data.trackingNumber;
//       document.getElementById('currentStatus').textContent = data.status;
  
//       // Generate timeline
//       const timeline = document.getElementById('timeline');
//       timeline.innerHTML = ''; // Clear existing content
  
//       // Add timeline items
//       data.timelines.forEach((event, index) => {
//         const timelineItem = createTimelineItem(event, index === 0);
//         timeline.insertAdjacentHTML('beforeend', timelineItem);
//       });
  
//     } catch (error) {
//       console.error('Error fetching tracking details:', error);
//       showError('Error loading tracking details. Please try again later.');
//     }
//   }
  
//   // Export functions for use in other files
//   export { loadTrackingDetails };








// Function to create a timeline item HTML string
function createTimelineItem(event, isActive) {
    return `
      <div class="relative flex items-start">
        <!-- Timeline dot -->
        <div class="absolute -left-[1.35rem] mt-1.5">
          <div class="h-4 w-4 rounded-full border-2 ${
            isActive ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'
          }"></div>
        </div>
        
        <!-- Content -->
        <div class="ml-6">
          <p class="font-semibold text-gray-800">${event.currentStatus}</p>
          <p class="text-sm text-gray-600">${event.location}</p>
          <p class="text-sm text-gray-500">${new Date(event.timestamp).toLocaleString()}</p>
        </div>
      </div>
    `;
  }
  
  // Function to show error message
  function showError(message) {
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = `
      <div class="text-red-500 p-4">
        ${message}
      </div>
    `;
  }
  
  // Main function to load tracking details
  export async function loadTrackingDetails(orderId, containerId = 'tracking-section') {
    const container = document.getElementById(containerId);
    
    try {
      // First load the HTML template
      const templateResponse = await fetch('/src/components/tracking-popup.html');
      if (!templateResponse.ok) throw new Error('Failed to load tracking template');
      const templateHtml = await templateResponse.text();
      
      // Insert the template into the container
      container.innerHTML = templateHtml;
  
      // Then fetch the tracking data
      const response = await fetch(`http://localhost:8081/order/track/order/${orderId}`);
      if (!response.ok) throw new Error('Failed to fetch tracking details');
      const data = await response.json();
  
      // Update basic information
      document.getElementById('displayOrderId').textContent = data.orderId;
      document.getElementById('carrier').textContent = data.carrier;
      document.getElementById('trackingNumber').textContent = data.trackingNumber;
      document.getElementById('currentStatus').textContent = data.status;
  
      // Generate timeline
      const timeline = document.getElementById('timeline');
      timeline.innerHTML = ''; // Clear existing content
  
      // Add timeline items
      data.timelines.forEach((event, index) => {
        const timelineItem = createTimelineItem(event, index === 0);
        timeline.insertAdjacentHTML('beforeend', timelineItem);
      });
  
    } catch (error) {
      console.error('Error loading tracking details:', error);
      container.innerHTML = `
        <div class="bg-white rounded-lg shadow-lg p-6">
          <div class="text-red-500 p-4">
            Error loading tracking details. Please try again later.
          </div>
        </div>
      `;
    }
  }