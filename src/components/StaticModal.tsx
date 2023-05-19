function StaticModal({ children, position }: any) {
  return (
    <>
      <div className={`fixed ${position} z-50 rounded-md`}>
        <div className="bg-white rounded-lg shadow dark:bg-gray-700">
          {children}
        </div>
      </div>
    </>
  )
}
export default StaticModal