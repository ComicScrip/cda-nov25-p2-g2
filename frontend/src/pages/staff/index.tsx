import Layout from "@/components/Layout";
import { useProfileQuery } from "@/graphql/generated/schema";
import formatDate from "@/utils/formatDate";

export default function StaffDashboard() {
  const { data } = useProfileQuery({ fetchPolicy: "cache-and-network" });
  const user = data?.me || null;
  // date du jour
  const date = new Date();

  // fn pour afficher mette la première lettre du nom de famille si pas d'avatar
  const getUserInitial = (lastName: string) => {
    return lastName.charAt(0).toUpperCase();
  };

  if (user)
    return (
      <Layout pageTitle="Staff">
        <div className="max-w-full mx-auto mt-15 md:max-w-[600px]">
          <h2 className="mt-18 p-4 text-right text-[#1b3c79] font-light">{formatDate(date)}</h2>
          <div className="w-[85%] py-10 bg-[#FEF9F6] rounded-4xl border-5 border-[#FFD771] mx-auto mb-10 flex items-center justify-evenly">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-sm font-bold overflow-hidden border-4 border-[#FFD771] md:w-24 md:h-24">
              {user.avatar ? (
                // biome-ignore lint/performance/noImgElement: <explanation>
                <img src={user.avatar} alt="" title={`${user.first_name} ${user.last_name}`} />
              ) : (
                getUserInitial(user.last_name)
              )}
            </div>
            <div className="text-[#1b3c79]">
              <p className="font-semibold text-2xl">{user && user.first_name}</p>
              <p>
                {user.group?.name} ({user.group?.children?.length})
              </p>
            </div>
          </div>

          {(user.group?.children?.length as number) > 0 &&
            user?.group?.children?.map((child) => (
              <div
                key={child.id}
                className="w-[85%] pt-4 pb-2 bg-[#FEF9F6] rounded-4xl border-5 border-[#FFD771] mx-auto flex flex-col items-center justify-evenly"
              >
                <div className="overflow-hidden">
                  {/** biome-ignore lint/performance/noImgElement: <explanation> */}
                  <img
                    src={child.picture}
                    alt=""
                    className="w-65 h-[180px] object-cover shadow-gray-300 shadow-xl cursor-pointer  ease-in-out duration-300 hover:scale-110 "
                  />
                </div>
                <p className="mt-1 text-2xl font-semibold text-[#1b3c79]">{child.firstName}</p>
              </div>
            ))}
        </div>
      </Layout>
    );
}
