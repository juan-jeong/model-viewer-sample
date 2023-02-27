/** model-viewer */


const setModelViewer = () => {
    // 주소창에서 src 파라미터를 받아옵니다.
    var src = location.search.split('src=')[1];
    console.log(src);

    // id="ohouse-model-viewer"인 요소를 찾아서 src 파라미터를 적용한 model viewer를 생성합니다.
    const modelViewer = document.createElement('model-viewer');
    modelViewer.src = src;
    modelViewer.alt = "A 3D model of ohouse sample";
    modelViewer.cameraControls = true;
    modelViewer.touchAction = "pan-y";
    modelViewer.generateSchema = true;
    modelViewer.shadowIntensity = 1;
    modelViewer.style.width = "100%";
    modelViewer.style.height = "100%";

    const modelViewerContainer = document.getElementById('ohouse-model-viewer');
    modelViewerContainer.style.width = "1000px";
    modelViewerContainer.style.height = "500px";
    modelViewerContainer.appendChild(modelViewer);

    SetTouchEventHandler(modelViewerContainer);
    SetCameraChangeEventHandler(modelViewer);

    // modelViewer.addEventListener('load', () => {
    //     autoAmination(modelViewer);
    // });
};

const SetCameraChangeEventHandler = (container) => {
    container.addEventListener('camera-change', (event) => {
        // if (webkit && webkit.messageHandlers && webkit.messageHandlers.onModelViewerCameraChange) {
        //     webkit.messageHandlers.onModelViewerCameraChange.postMessage('camera-change-sample');
        // }
    });
}

var firstTouch = true;
const SetTouchEventHandler = (container) => {
    container.addEventListener('touchstart', (event) => {
        if (firstTouch) {
            if (webkit && webkit.messageHandlers && webkit.messageHandlers.onModelViewerTouchStart) {
                webkit.messageHandlers.onModelViewerTouchStart.postMessage('touchstart-sample');
            }
            firstTouch = false;
        }
    });
}


const autoAmination = (modelViewer) => {
    const orbitCycle = [
        '45deg 55deg 4m',
        '-60deg 110deg 2m',
        modelViewer.cameraOrbit
    ];


    setInterval(() => {
        const currentOrbitIndex = orbitCycle.indexOf(modelViewer.cameraOrbit);
        modelViewer.cameraOrbit =
            orbitCycle[(currentOrbitIndex + 1) % orbitCycle.length];
    }, 3000);
}

// when the page is loaded, setModelViewer() is called.
window.onload = setModelViewer;