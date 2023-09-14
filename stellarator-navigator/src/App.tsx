// May trim font references later
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import MainWindow from '@snComponents/MainWindow'
import SetupFilterContext from '@snState/NavigatorContext'
import './App.css'

function App() {
    return (
        <SetupFilterContext>
            <MainWindow />
        </SetupFilterContext>
      )
}

export default App
