// May trim font references later
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './App.css'
import MainWindow from './pages/MainWindow'
import SetupFilterContext from './state/NavigatorContext'


function App() {
    // TODO: Initializations, state, wrappers.
    // See MCMCMonitor App.tsx for examples.
    // This will probably involve loading the (hard-coded?) database info (?)
    // (Or maybe that happens via query?)

    return (
        <SetupFilterContext>
            <MainWindow />
        </SetupFilterContext>
      )
}

export default App
