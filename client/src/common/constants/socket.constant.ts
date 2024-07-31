const useDeployedProductionURL = true

const SOCKET_URL = useDeployedProductionURL
  ? 'https://lecture-starter-patterns-production-a935.up.railway.app/'
  : 'http://localhost:3005'

export { SOCKET_URL }
