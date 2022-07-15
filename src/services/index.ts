import { SchoolType, Service } from '../types'
import SZTU from './sztu'
import SZU from './szu'

const services: Record<SchoolType, Service> = {
  SZU,
  SZTU
}

export function getService (school: SchoolType): Service {
  const service = services[school]
  if (!service) {
    throw new Error(`No service for school ${school}`)
  }
  return service
}
