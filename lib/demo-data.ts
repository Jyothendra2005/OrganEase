export type Organ = {
  id: string
  organ: string
  donor: string
  blood: string
  location: string
  distance: string
  preservation: string
  expires: string
  urgency: 'Critical' | 'Priority' | 'Routine'
  center: string
}

export type OrganRequest = {
  id: string
  organ: string
  blood: string
  hospital: string
  age: string
  status: string
  urgent: boolean
}

export const demoInventory: Organ[] = [
  { id: 'ORG-4821', organ: 'Kidney', donor: 'Anonymous donor', blood: 'O+', location: 'Pune Procurement Centre', distance: '14 km', preservation: 'Hypothermic storage', expires: '05h 42m', urgency: 'Critical', center: 'Pune PPC' },
  { id: 'ORG-4818', organ: 'Liver', donor: 'Anonymous donor', blood: 'A+', location: 'Ruby Hall Transplant Unit', distance: '22 km', preservation: 'Hypothermic storage', expires: '11h 18m', urgency: 'Priority', center: 'Ruby Hall' },
  { id: 'ORG-4815', organ: 'Heart', donor: 'Anonymous donor', blood: 'B+', location: 'Noble Hospital Centre', distance: '31 km', preservation: 'Perfusion maintained', expires: '03h 09m', urgency: 'Critical', center: 'Noble Hospital' },
  { id: 'ORG-4809', organ: 'Kidney', donor: 'Anonymous donor', blood: 'AB+', location: 'Sahyadri Hospitals', distance: '38 km', preservation: 'Hypothermic storage', expires: '19h 36m', urgency: 'Routine', center: 'Sahyadri' },
  { id: 'ORG-4804', organ: 'Pancreas', donor: 'Anonymous donor', blood: 'O-', location: 'Jehangir Transplant Unit', distance: '41 km', preservation: 'Hypothermic storage', expires: '09h 04m', urgency: 'Priority', center: 'Jehangir' },
]

export const demoRequests: OrganRequest[] = [
  { id: 'REQ-2094', organ: 'Kidney', blood: 'O+', hospital: 'Sahyadri Hospitals', age: '8 min ago', status: 'Awaiting payment', urgent: true },
  { id: 'REQ-2091', organ: 'Liver', blood: 'A+', hospital: 'Ruby Hall Clinic', age: '42 min ago', status: 'Confirmed', urgent: false },
  { id: 'REQ-2088', organ: 'Heart', blood: 'B+', hospital: 'Noble Hospital', age: '1 hr ago', status: 'In transit', urgent: true },
]