export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Service {
  serviceId: string;
  categoryId: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  rating: number;
}

export interface Professional {
  proId: string;
  name: string;
  skill: string[];
  rating: number;
  jobsCompleted: number;
}

export const categories: Category[] = [
  { id: 'c1', name: 'Salon at Home', icon: 'Scissors', color: 'bg-pink-100 text-pink-600' },
  { id: 'c2', name: 'Appliance Repair', icon: 'Wrench', color: 'bg-blue-100 text-blue-600' },
  { id: 'c3', name: 'Cleaning', icon: 'Sparkles', color: 'bg-green-100 text-green-600' },
  { id: 'c4', name: 'Plumbing', icon: 'Droplet', color: 'bg-cyan-100 text-cyan-600' },
  { id: 'c5', name: 'Electrician', icon: 'Zap', color: 'bg-yellow-100 text-yellow-600' },
  { id: 'c6', name: 'Painting', icon: 'PaintRoller', color: 'bg-purple-100 text-purple-600' },
];

export const services: Service[] = [
  { serviceId: 's1', categoryId: 'c1', name: 'Haircut & Styling', price: 499, duration: '45 mins', description: 'Professional haircut and styling at your home.', rating: 4.8 },
  { serviceId: 's2', categoryId: 'c1', name: 'Facial & Cleanup', price: 999, duration: '60 mins', description: 'Deep cleansing facial with premium products.', rating: 4.7 },
  { serviceId: 's7', categoryId: 'c1', name: 'Manicure & Pedicure', price: 799, duration: '90 mins', description: 'Complete hand and foot care with polish.', rating: 4.9 },
  { serviceId: 's8', categoryId: 'c1', name: 'Party Makeup', price: 2499, duration: '120 mins', description: 'Full face makeup and hairstyling by experts.', rating: 4.6 },
  { serviceId: 's3', categoryId: 'c2', name: 'AC Service & Repair', price: 699, duration: '90 mins', description: 'Complete AC servicing and minor repairs.', rating: 4.9 },
  { serviceId: 's4', categoryId: 'c3', name: 'Intense Home Cleaning', price: 2999, duration: '4-5 hrs', description: 'Deep cleaning of the entire home with mechanized equipment.', rating: 4.6 },
  { serviceId: 's5', categoryId: 'c4', name: 'Leakage Repair', price: 299, duration: '30 mins', description: 'Fixing basic plumbing leakages.', rating: 4.5 },
  { serviceId: 's6', categoryId: 'c5', name: 'Switchboard Repair', price: 199, duration: '30 mins', description: 'Repair or replace faulty switchboards.', rating: 4.8 },
];

export const professionals: Professional[] = [
  { proId: 'p1', name: 'Rahul Sharma', skill: ['Plumbing', 'Electrician'], rating: 4.8, jobsCompleted: 142 },
  { proId: 'p2', name: 'Anita Verma', skill: ['Salon at Home'], rating: 4.9, jobsCompleted: 350 },
  { proId: 'p3', name: 'Mohammad Ali', skill: ['Appliance Repair'], rating: 4.7, jobsCompleted: 89 },
];
