import { API_URLS } from "../api-constants.js";

let trackingDetails = null;

function createTimelineItem(event, index, isActive, isPast) {
  return `
      <div class="relative">
        <!-- Status Icon -->
        <div class="flex items-center">
          <div class="relative flex items-center justify-center w-8 h-8 rounded-full ${isActive ? 'bg-blue-600' :
      isPast ? 'bg-green-500' : 'bg-gray-200'
    }">
            ${getStatusIcon(isActive, isPast)}
          </div>
          ${index < 3 ? `
            <div class="flex-1 h-1 ml-4 ${isPast ? 'bg-green-500' : 'bg-gray-200'
      }"></div>
            ` : ''
    }
        </div>
        
        <!-- Status Content -->
        <div class="mt-3">
          <h3 class="text-sm font-semibold ${isActive ? 'text-blue-600' :
      isPast ? 'text-green-600' : 'text-gray-500'
    }">${event.currentStatus}</h3>
          <p class="mt-1 text-sm text-gray-500">${event.location}</p>
          <p class="mt-1 text-xs text-gray-400">${formatDate(event.timestamp)}</p>
        </div>
      </div>
    `;
}

function getStatusIcon(isActive, isPast) {
  if (isActive) {
    return `<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>`;
  }
  if (isPast) {
    return `<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>`;
  }
  return '';
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}


function formatReturnDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
      month: 'long',  
      day: 'numeric',
      year: 'numeric' 
  });
}

function showError(container, message) {
  container.innerHTML = `
      <div class="bg-white rounded-xl shadow-lg p-8">
        <div class="text-red-500 text-center">
          ${message}
        </div>
      </div>
    `;
}

export async function loadTrackingDetails(orderId, containerId = 'tracking-section') {
  const container = document.getElementById(containerId);
  try {
    await loadTemplate(containerId);
    const response = await fetch(API_URLS.TRACK_ORDER(orderId));
    if (!response.ok) throw new Error('Failed to fetch tracking details');
    trackingDetails = await response.json();
    renderTrackingDetails(trackingDetails, containerId);

  } catch (error) {
    console.error('Error:', error);
    showError(container, 'Error loading tracking details. Please try again later.');
  }
}

export async function renderTrackingDetails(trackingDetails, containerId = 'tracking-section') {
  const container = document.getElementById(containerId);
  await loadTemplate(containerId);

  try {

   const returnWindowElement = document.getElementById('returnWindow');

    returnWindowElement.innerHTML = `Return Window closed on<br><strong>${formatReturnDate(trackingDetails.returnWindowClosedOn)}</strong>`;

    document.getElementById('carrier').textContent = trackingDetails.carrier;
    document.getElementById('trackingNumber').textContent = trackingDetails.trackingNumber;
    document.getElementById('currentStatus').textContent = trackingDetails.status;
    const timeline = document.getElementById('timeline');
    timeline.innerHTML = '';

    const currentIndex = trackingDetails.timelines.findIndex(event => event.currentStatus === trackingDetails.status);

    trackingDetails.timelines.forEach((event, index) => {
      const isActive = index === currentIndex;
      const isPast = index < currentIndex;
      timeline.insertAdjacentHTML('beforeend', createTimelineItem(event, index, isActive, isPast));
    });
  } catch (error) {
    console.error('Error:', error);
    showError(container, 'Error loading tracking details. Please try again later.');
  }

}

async function loadTemplate(containerId) {
  const container = document.getElementById(containerId);
  const templateResponse = await fetch('/src/components/tracking-popup.html');
  if (!templateResponse.ok) throw new Error('Failed to load tracking template');
  container.innerHTML = await templateResponse.text();
}