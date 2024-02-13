export interface Project {
  projectId?: number;
  projectName: string;
  description: string;
  startDate: string; // Adjust the date format if needed
  endDate: string;   // Adjust the date format if needed
  budget: number;
  status: string;
  serviceType: string;
  location: string;
  bookingAvailability: string;
  seller_id?: number;  // Assuming you have a Seller interface
   // Assuming the photos are an array of strings
}
