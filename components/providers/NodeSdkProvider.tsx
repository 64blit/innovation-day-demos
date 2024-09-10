// import {
//   createContext,
//   useState,
//   useEffect,
//   ReactNode,
//   useContext,
//   PropsWithChildren,
//   useRef,
// } from 'react'

// let Render2d: any = null
// let EyePop: any = null

// export async function loadEyePopModules() {
//     try {
//         if (!EyePop) {
//             await import('@eyepop.ai/eyepop').then((module) => {
//                 if (EyePop) return
//                 EyePop = module.EyePop
//                 console.log('NodeSdkContext: Loaded EyePop modules', EyePop)
//             })
//         }
        
//         if (!Render2d) {
//             await import('@eyepop.ai/eyepop-render-2d').then((module) => {
//                 if (Render2d) return
//                 Render2d = module.Render2d
//                 console.log('NodeSdkContext: Loaded EyePop modules', Render2d)
//             })
//         }
//     } catch (e) {
//         console.error(e)
//     }
// }


// const NodeSdkContext = createContext<NodeSdkContextProps | null>(null)

// interface NodeSdkContextProps {
//   results: object | null | undefined
// }

// type NodeSdkProviderProps = {
// }



// function NodeSdkProvider({
//   children,
// }: PropsWithChildren<NodeSdkProviderProps>) {
//   loadEyePopModules()


//   return (
//     <NodeSdkContext.Provider
//       value={{


//       }}>
//       {children}
//     </NodeSdkContext.Provider>
//   )
// }

// function useNodeSdk() {
//   const context = useContext(NodeSdkContext)
//   if (context === null) {
//     throw new Error('useNodeSdk must be used within an NodeSdkProvider')
//   }
//   return context
// }

// export { useNodeSdk, NodeSdkProvider }
