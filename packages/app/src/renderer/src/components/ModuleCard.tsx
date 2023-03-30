export default function ModuleCard({ title, description }) {
  return (
    <div className="card card-side bg-base-100 shadow-xl">
      <figure>
        {/* <img src="https://daisyui.com/images/stock/photo-1494232410401-ad00d5433cfa.jpg" /> */}
      </figure>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{description}</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Enable | Disable</button>
        </div>
      </div>
    </div>
  )
}
