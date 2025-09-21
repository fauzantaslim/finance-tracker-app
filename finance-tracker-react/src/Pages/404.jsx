import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function NotFoundPage() {
  const error = useRouteError();
  return (
    <div>
      <h1>OPPS Silahkan kembali ke jalan yg benar</h1>
      <p>
        {isRouteErrorResponse(error)
          ? error.statusText
          : error instanceof Error
          ? error.message
          : "Terjadi kesalahan yang tidak diketahui"}
      </p>
    </div>
  );
}
