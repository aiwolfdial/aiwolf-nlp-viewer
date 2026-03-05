/**
 * 矢印描画のためのユーティリティ関数
 */

/**
 * 矢印の座標情報
 */
export interface ArrowCoordinates {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

/**
 * SVGパス用の矢印形状を計算
 */
export interface ArrowPath {
    path: string;
    color: string;
}

/**
 * 2点間の角度を計算（度数法）
 */
export function calculateAngle(x1: number, y1: number, x2: number, y2: number): number {
    const rad = Math.atan2(y2 - y1, x2 - x1);
    return (rad * 180) / Math.PI;
}

/**
 * 2点間の距離を計算
 */
export function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * SVG用の矢印パスを生成
 * @param x1 始点X座標
 * @param y1 始点Y座標
 * @param x2 終点X座標
 * @param y2 終点Y座標
 * @param isCenter 中央からの矢印かどうか
 * @returns SVGパス文字列
 */
export function createArrowPath(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    isCenter: boolean
): string {
    const angle = calculateAngle(x1, y1, x2, y2);
    const length = calculateDistance(x1, y1, x2, y2);

    // 矢印の形状を定義（中央からかエージェント間かで変える）
    const arrowShape = isCenter
        ? [
              { x: 0, y: 0 },
              { x: 0, y: 0 },
              { x: 0, y: 30 },
          ]
        : [
              { x: 0, y: 5 },
              { x: -20, y: 5 },
              { x: -20, y: 15 },
          ];

    // パスポイントを生成
    const points: { x: number; y: number }[] = [];

    // 始点
    points.push({ x: 0, y: 0 });

    // 上側の矢じり
    for (const shape of arrowShape) {
        const x = shape.x < 0 ? length + shape.x : shape.x;
        points.push({ x, y: shape.y });
    }

    // 先端
    points.push({ x: length, y: 0 });

    // 下側の矢じり（上側を反転）
    for (let i = arrowShape.length - 1; i >= 0; i--) {
        const shape = arrowShape[i];
        const x = shape.x < 0 ? length + shape.x : shape.x;
        points.push({ x, y: -shape.y });
    }

    // パス文字列を構築
    const pathParts = points.map((point, i) => {
        const cmd = i === 0 ? "M" : "L";
        return `${cmd} ${point.x} ${point.y}`;
    });
    pathParts.push("Z"); // パスを閉じる

    return pathParts.join(" ");
}

/**
 * 要素の中心座標を取得
 * @param elementId 要素のID
 * @param containerRect コンテナのBoundingClientRect
 * @returns 中心座標、要素が見つからない場合はnull
 */
export function getElementCenter(
    elementId: string,
    containerRect: DOMRect
): { x: number; y: number } | null {
    const element = document.getElementById(elementId);
    if (!element) return null;

    const rect = element.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2 - containerRect.left,
        y: rect.top + rect.height / 2 - containerRect.top,
    };
}

/**
 * Canvas用の矢印を描画
 * @deprecated SVGの使用を推奨
 */
export function drawArrowOnCanvas(
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    isCenter: boolean,
    color: string
): void {
    const arrowShape = isCenter ? [0, 0, 0, 0, 0, 30] : [0, 5, -20, 5, -20, 15];

    ctx.strokeStyle = ctx.fillStyle = color;

    ctx.beginPath();
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const sin = dy / len;
    const cos = dx / len;
    const points = [];
    points.push(0, 0);
    for (let i = 0; i < arrowShape.length; i += 2) {
        const x = arrowShape[i];
        const y = arrowShape[i + 1];
        points.push(x < 0 ? len + x : x, y);
    }
    points.push(len, 0);
    for (let i = arrowShape.length; i > 0; i -= 2) {
        const x = arrowShape[i - 2];
        const y = arrowShape[i - 1];
        points.push(x < 0 ? len + x : x, -y);
    }
    points.push(0, 0);
    for (let i = 0; i < points.length; i += 2) {
        const x = points[i] * cos - points[i + 1] * sin + x1;
        const y = points[i] * sin + points[i + 1] * cos + y1;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.fill();
}
