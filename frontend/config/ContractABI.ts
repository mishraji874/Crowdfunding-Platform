import { Interface } from 'ethers'
import artifact from './ContractABI.json'

export const ContractABI = new Interface(artifact.abi);
