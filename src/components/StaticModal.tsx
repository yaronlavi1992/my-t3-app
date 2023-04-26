function StaticModal({ children, position }: any) {
  return (
    <>
      <div className={`fixed ${position || 'top-20 left-80'} z-50 rounded-md`}>
        <div className="bg-white rounded-lg shadow dark:bg-gray-700">
          {children}
        </div>
      </div>
    </>
  )
}
export default StaticModal