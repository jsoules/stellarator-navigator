// May trim font references later
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './App.css'
import MainWindow from './pages/MainWindow'
import SetupFilterContext from './state/NavigatorContext'

function App() {
    return (
        <SetupFilterContext>
            <MainWindow />
        </SetupFilterContext>
      )
}

export default App
