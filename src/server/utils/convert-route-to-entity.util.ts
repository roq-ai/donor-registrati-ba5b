const mapping: Record<string, string> = {
  hospitals: 'hospital',
  'prospective-donors': 'prospective_donor',
  'screening-questions': 'screening_question',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
