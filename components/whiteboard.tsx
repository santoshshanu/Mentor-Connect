'use client';

import React, { useRef, useEffect, useState, MouseEvent } from "react";

// Define types for drawing actions and styles
interface DrawingAction {
  path: { x: number; y: number }[];
  style: { color: string; lineWidth: number };
}

const WhiteboardCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
    const [drawing, setDrawing] = useState<boolean>(false);
    const [currentColor, setCurrentColor] = useState<string>('black');
    const [drawingActions, setDrawingActions] = useState<DrawingAction[]>([]);
    const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
    const [currentStyle, setCurrentStyle] = useState<{ color: string; lineWidth: number }>({ color: 'black', lineWidth: 3 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = 900;
            canvas.height = 500;
            const ctx = canvas.getContext('2d');
            setContext(ctx);
            if (ctx) {
                reDrawPreviousData(ctx);
            }
        }
    }, []);

    const startDrawing = (e: MouseEvent<HTMLCanvasElement>) => {
        const ctx = context;
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            setDrawing(true);
        }
    };

    const draw = (e: MouseEvent<HTMLCanvasElement>) => {
        if (!drawing) return;
        const ctx = context;
        if (ctx) {
            ctx.strokeStyle = currentStyle.color;
            ctx.lineWidth = currentStyle.lineWidth;
            ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
            ctx.stroke();
            setCurrentPath(prevPath => [...prevPath, { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }]);
        }
    };

    const endDrawing = () => {
        setDrawing(false);
        const ctx = context;
        if (ctx) {
            ctx.closePath();
        }
        if (currentPath.length > 0) {
            setDrawingActions(prevActions => [...prevActions, { path: currentPath, style: currentStyle }]);
        }
        setCurrentPath([]);
    };

    const changeColor = (color: string) => {
        setCurrentStyle(prevStyle => ({ ...prevStyle, color }));
        setCurrentColor(color);
    };

    const changeWidth = (width: string) => {
        setCurrentStyle(prevStyle => ({ ...prevStyle, lineWidth: Number(width) }));
    };

    const undoDrawing = () => {
        if (drawingActions.length > 0) {
            const updatedDrawingActions = [...drawingActions];
            updatedDrawingActions.pop();
            setDrawingActions(updatedDrawingActions);

            const canvas = canvasRef.current;
            if (canvas) {
                const newContext = canvas.getContext('2d');
                if (newContext) {
                    newContext.clearRect(0, 0, canvas.width, canvas.height);
                    reDrawPreviousData(newContext);
                }
            }
        }
    };

    const clearDrawing = () => {
        setDrawingActions([]);
        setCurrentPath([]);
        const canvas = canvasRef.current;
        if (canvas) {
            const newContext = canvas.getContext('2d');
            if (newContext) {
                newContext.clearRect(0, 0, canvas.width, canvas.height);
            }
        }
    };

    const reDrawPreviousData = (ctx: CanvasRenderingContext2D) => {
        drawingActions.forEach(({ path, style }) => {
            ctx.beginPath();
            ctx.strokeStyle = style.color;
            ctx.lineWidth = style.lineWidth;
            ctx.moveTo(path[0].x, path[0].y);
            path.forEach((point) => {
                ctx.lineTo(point.x, point.y);
            });
            ctx.stroke();
        });
    };

    return (
        <div>
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={endDrawing}
                onMouseOut={endDrawing}
                className="border border-grey-200"
            />
            <div className="flex my-4 items-center space-x-4">
                <div className="flex justify-center space-x-4">
                    {['red', 'blue', 'yellow', 'green', 'orange', 'black'].map((color) => (
                        <div
                            key={color}
                            className={`w-8 h-8 rounded-full cursor-pointer ${currentColor === color ? `bg-${color}-700` : `bg-${color}-400`}`}
                            style={{ backgroundColor: color }}
                            onClick={() => changeColor(color)}
                        />
                    ))}
                </div>
                <button onClick={clearDrawing} className="px-4 py-2 bg-red-500 text-white rounded">Clear</button>
                <button onClick={undoDrawing} className="px-4 py-2 bg-blue-500 text-white rounded">Undo</button>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={currentStyle.lineWidth}
                    onChange={(e) => changeWidth(e.target.value)}
                    className="mx-4"
                />
                <span>Line Width: {currentStyle.lineWidth}</span>
            </div>
        </div>
    );
}

export default WhiteboardCanvas;
